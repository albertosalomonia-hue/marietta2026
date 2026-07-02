-- Contratos Marietta — esquema de base de datos para Supabase.
-- Ejecutar completo una sola vez en: Supabase Dashboard > SQL Editor > New query > Run.
-- Es seguro volver a ejecutarlo (usa "if not exists" / "or replace" en todo).

create extension if not exists pgcrypto;

-- =========================================================
-- TABLAS
-- =========================================================

create table if not exists public.employer_config (
  id boolean primary key default true,
  razon_social text not null default '',
  ruc text not null default '',
  domicilio_fiscal text not null default '',
  gerente text not null default '',
  gerente_dni text not null default '',
  fecha_inicio_actividades text not null default '',
  fecha_remype text not null default '',
  fecha_acreditacion text not null default '',
  gerente_firma_path text,
  updated_at timestamptz not null default now(),
  constraint employer_config_singleton check (id)
);

create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  dni text not null,
  domicilio text not null default '',
  cargo text not null default '',
  foto_path text,
  pin text,
  duracion_valor integer not null default 1,
  duracion_unidad text not null default 'meses' check (duracion_unidad in ('meses', 'dias')),
  alerta_dias_antes integer not null default 7,
  fecha_inicio_primer_contrato date not null default current_date,
  jornada_texto text not null default '',
  jurisdiccion text not null default '',
  remuneracion_monto numeric(10, 2) not null default 0,
  remuneracion_moneda_texto text not null default '',
  gastos_examen_medico numeric(10, 2) not null default 0,
  gastos_cursos numeric(10, 2) not null default 0,
  gastos_seguros numeric(10, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.contratos (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  fecha_inicio date not null,
  fecha_fin date not null,
  fecha_firma date not null,
  plazo_texto text not null,
  monto numeric(10, 2) not null,
  generado_en timestamptz not null default now(),
  firma_empleado_path text,
  firma_empleado_en timestamptz,
  leido_en timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists contratos_employee_id_idx on public.contratos(employee_id);

insert into public.employer_config (id, razon_social, ruc, domicilio_fiscal, gerente, gerente_dni, fecha_inicio_actividades, fecha_remype, fecha_acreditacion)
values (
  true,
  'TRANSPORTES MARIETTA E.I.R.L.',
  '20609440652',
  'JR. RAMÓN CASTILLA NRO. 748 Sec. 5, distrito de Iquitos, Provincia de Maynas y Departamento de Loreto',
  'MANUEL JESÚS AGUILAR LAVANDA',
  '43664762',
  '10 de octubre de 2022',
  '05 de Mayo del 2022',
  '24 de Noviembre del 2022'
)
on conflict (id) do nothing;

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================
-- El admin real (Supabase Auth, rol "authenticated") tiene acceso completo.
-- El portal de empleado NO usa Supabase Auth (entra con PIN dentro de la app),
-- así que el rol "anon" NO tiene acceso directo a employees/contratos: solo
-- puede interactuar a través de las funciones RPC de abajo, que exponen
-- exclusivamente lo necesario (nunca la tabla completa).

alter table public.employer_config enable row level security;
alter table public.employees enable row level security;
alter table public.contratos enable row level security;

drop policy if exists employer_config_select_all on public.employer_config;
create policy employer_config_select_all
  on public.employer_config for select
  to anon, authenticated
  using (true);

drop policy if exists employer_config_write_admin on public.employer_config;
create policy employer_config_write_admin
  on public.employer_config for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists employees_admin_all on public.employees;
create policy employees_admin_all
  on public.employees for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists contratos_admin_all on public.contratos;
create policy contratos_admin_all
  on public.contratos for all
  to authenticated
  using (true)
  with check (true);

-- =========================================================
-- FUNCIONES RPC para el portal de empleado (rol anon)
-- =========================================================

-- Lista mínima (id + nombre) para el selector "¿quién eres?" del login de empleado.
create or replace function public.listar_empleados_login()
returns table(id uuid, nombre text)
language sql
security definer
set search_path = public
as $$
  select id, nombre from public.employees order by nombre;
$$;

grant execute on function public.listar_empleados_login() to anon;

-- Valida el PIN en el servidor y, si coincide, devuelve los datos del empleado
-- (sin exponer el de otros) junto con su historial de contratos.
create or replace function public.login_empleado(p_employee_id uuid, p_pin text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_employee public.employees%rowtype;
  v_result json;
begin
  select * into v_employee from public.employees where id = p_employee_id;

  if v_employee.id is null then
    return null;
  end if;

  if v_employee.pin is null or v_employee.pin = '' or v_employee.pin <> p_pin then
    return null;
  end if;

  select json_build_object(
    'id', v_employee.id,
    'nombre', v_employee.nombre,
    'dni', v_employee.dni,
    'domicilio', v_employee.domicilio,
    'cargo', v_employee.cargo,
    'foto_path', v_employee.foto_path,
    'duracion_valor', v_employee.duracion_valor,
    'duracion_unidad', v_employee.duracion_unidad,
    'alerta_dias_antes', v_employee.alerta_dias_antes,
    'fecha_inicio_primer_contrato', v_employee.fecha_inicio_primer_contrato,
    'jornada_texto', v_employee.jornada_texto,
    'jurisdiccion', v_employee.jurisdiccion,
    'remuneracion_monto', v_employee.remuneracion_monto,
    'remuneracion_moneda_texto', v_employee.remuneracion_moneda_texto,
    'gastos_examen_medico', v_employee.gastos_examen_medico,
    'gastos_cursos', v_employee.gastos_cursos,
    'gastos_seguros', v_employee.gastos_seguros,
    'contratos', (
      select coalesce(json_agg(t), '[]'::json)
      from (
        select * from public.contratos
        where employee_id = v_employee.id
        order by fecha_inicio
      ) t
    )
  ) into v_result;

  return v_result;
end;
$$;

grant execute on function public.login_empleado(uuid, text) to anon;

-- Marca un contrato como leído (una sola vez; llamadas repetidas no pisan la fecha original).
create or replace function public.marcar_contrato_leido(p_contrato_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.contratos
  set leido_en = now()
  where id = p_contrato_id and leido_en is null;
$$;

grant execute on function public.marcar_contrato_leido(uuid) to anon;

-- Adjunta la firma del empleado a su contrato (el archivo ya debe estar subido a Storage).
create or replace function public.firmar_contrato_empleado(p_contrato_id uuid, p_firma_path text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.contratos
  set firma_empleado_path = p_firma_path, firma_empleado_en = now()
  where id = p_contrato_id;
$$;

grant execute on function public.firmar_contrato_empleado(uuid, text) to anon;

-- =========================================================
-- STORAGE: bucket privado para fotos y firmas
-- =========================================================

insert into storage.buckets (id, name, public)
values ('contratos-files', 'contratos-files', false)
on conflict (id) do nothing;

drop policy if exists contratos_files_admin_all on storage.objects;
create policy contratos_files_admin_all
  on storage.objects for all
  to authenticated
  using (bucket_id = 'contratos-files')
  with check (bucket_id = 'contratos-files');

-- El portal de empleado necesita generar URLs firmadas para mostrar fotos/firmas
-- dentro de su propio contrato (no hay forma de filtrar por "dueño" sin auth real,
-- pero las rutas usan UUIDs no adivinables).
drop policy if exists contratos_files_anon_select on storage.objects;
create policy contratos_files_anon_select
  on storage.objects for select
  to anon
  using (bucket_id = 'contratos-files');

-- El empleado solo puede SUBIR su firma dentro de la carpeta "signatures/".
drop policy if exists contratos_files_anon_insert_signatures on storage.objects;
create policy contratos_files_anon_insert_signatures
  on storage.objects for insert
  to anon
  with check (bucket_id = 'contratos-files' and (storage.foldername(name))[1] = 'signatures');
