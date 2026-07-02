import { formatearFechaLarga } from '../utils/fechas'
import { montoALetras } from '../utils/numeroALetras'

export function Clausula({ titulo, children }) {
  return (
    <section className="mb-4">
      <h3 className="mb-1 text-[13px] font-bold uppercase text-slate-900">{titulo}</h3>
      <div className="space-y-2 text-justify text-[12.5px] leading-relaxed text-slate-800">{children}</div>
    </section>
  )
}

export function HeaderBlock({ pageNumber, totalPages }) {
  return (
    <table className="mb-6 w-full border border-slate-400 text-[11px]">
      <tbody>
        <tr>
          <td rowSpan={4} className="w-28 border border-slate-400 p-2 text-center align-middle">
            <div className="text-lg font-black leading-none text-indigo-900">MARIETTA</div>
            <div className="text-[9px] leading-none text-slate-500">TRANSPORTE FLUVIAL</div>
          </td>
          <td rowSpan={4} className="border border-slate-400 p-2 text-center align-middle text-[13px] font-bold">
            CONTRATO DE TRABAJO SUJETO A MODALIDAD
          </td>
          <td className="border border-slate-400 px-2 py-0.5 font-semibold">Código</td>
          <td className="border border-slate-400 px-2 py-0.5">FOR-SIG-XX</td>
        </tr>
        <tr>
          <td className="border border-slate-400 px-2 py-0.5 font-semibold">Revisión</td>
          <td className="border border-slate-400 px-2 py-0.5">00</td>
        </tr>
        <tr>
          <td className="border border-slate-400 px-2 py-0.5 font-semibold">Fecha</td>
          <td className="border border-slate-400 px-2 py-0.5">22-02-2023</td>
        </tr>
        <tr>
          <td className="border border-slate-400 px-2 py-0.5 font-semibold">Pág.</td>
          <td className="border border-slate-400 px-2 py-0.5">{pageNumber} de {totalPages}</td>
        </tr>
      </tbody>
    </table>
  )
}

export function buildContractBlocks(data) {
  const { empleador, trabajador, contrato, remuneracion, gastos } = data

  const fechaInicioLarga = formatearFechaLarga(contrato.fechaInicio)
  const fechaFinLarga = formatearFechaLarga(contrato.fechaFin)
  const fechaFirmaLarga = formatearFechaLarga(contrato.fechaFirma)
  const montoNum = Number(remuneracion.monto) || 0
  const montoLetras = remuneracion.monedaTexto?.trim() || montoALetras(montoNum)
  const montoFormateado = montoNum.toFixed(2)

  const examenMedico = Number(gastos.examenMedico) || 0
  const cursos = Number(gastos.cursos) || 0
  const seguros = Number(gastos.seguros) || 0

  return [
    {
      key: 'intro',
      node: (
        <>
          <h2 className="mb-4 text-center text-[13px] font-bold underline">
            CONTRATO TEMPORAL DE TRABAJO SUJETO A MODALIDAD POR INICIO DE ACTIVIDAD
          </h2>
          <p className="mb-4 text-justify text-[12.5px] leading-relaxed">
            Conste por el presente documento, suscrito por duplicado de igual valor y tenor, Contrato Temporal de
            Trabajo sujeto a modalidad por inicio de actividad (en adelante <b>EL CONTRATO</b>) que al amparo del
            artículo 57° del Texto Único Ordenado del Decreto Legislativo 728 - Ley de Productividad y
            Competitividad Laboral aprobado por el Decreto Supremo N° 003-97-TR - y el Reglamento del TUO de la Ley
            de Fomento del Empleo aprobado por el Decreto Supremo N° 001-96-TR, celebran de una parte{' '}
            <b>{empleador.razonSocial}</b> identificada con RUC N° <b>{empleador.ruc}</b>, con domicilio fiscal en{' '}
            <b>{empleador.domicilioFiscal}</b>, debidamente representada por su Gerente General, el Sr.{' '}
            <b>{empleador.gerente}</b>, identificado con DNI N.º <b>{empleador.gerenteDni}</b>, (en adelante “
            <b>EL EMPLEADOR</b>”); y de la otra parte, el Sr. <b>{trabajador.nombre}</b>, identificado con D.N.I.
            N°. <b>{trabajador.dni}</b>, con domicilio real en <b>{trabajador.domicilio}</b> (en adelante “
            <b>EL TRABAJADOR</b>”), ambos denominados conjuntamente como “<b>LAS PARTES</b>”, en los términos y
            condiciones contenidos en las cláusulas siguientes:
          </p>
        </>
      ),
    },
    {
      key: 'c1',
      node: (
        <Clausula titulo="CLÁUSULA PRIMERA. - ANTECEDENTES">
          <p>
            1.1. El EMPLEADOR es una persona jurídica de derecho privado constituida bajo la forma de empresa
            individual de responsabilidad limitada (E.I.R.L.), cuyo objeto social es la prestación de servicios de
            transporte de valor añadido a clientes y/o a consumidores y usuarios actuales y particulares de sus
            clientes.
          </p>
          <p>
            1.2. EL EMPLEADOR ha iniciado actividades el <b>{empleador.fechaInicioActividades}</b>, y está
            ingresado al mercado de transporte de valor añadido. En el presente año, EL EMPLEADOR está enfocado más
            que todo a cubrir una situación específica, es decir en el proceso de consolidación en el mercado de
            transporte de valor añadido. Lo más difícil es ingresar al mercado, desarrollar sus actividades con un
            personal estable o a tiempo indeterminado agravaría en muchos casos la incertidumbre si es que el
            negocio va a tener los resultados esperados, razón por la cual se requiere contar con la contratación
            de personal, entre los cuales se encuentra EL TRABAJADOR, al amparo de lo previsto en el artículo 57°
            de la LPCL.
          </p>
          <p>
            1.3. EL EMPLEADOR opera al amparo del Decreto Legislativo N° 1086 – Ley de Promoción de la
            Competitividad, Formalización y Desarrollo de la Micro y Pequeña Empresa y del Acceso al Empleo Decente
            y de su Reglamento el D.S. N° 008-2008-TR, se encuentra inscrita ante la Autoridad Administrativa de
            Trabajo como Microempresa en el Registro de la Micro y Pequeña Empresa (REMYPE) desde el{' '}
            <b>{empleador.fechaRemype}</b>; y acreditada además, desde el <b>{empleador.fechaAcreditacion}</b>, por
            lo que a partir de esta fecha goza de los beneficios que le confiere el TUO de la Ley de Promoción de
            la Competitividad, Formalización y Desarrollo de la Micro y Pequeña Empresa y del Acceso al Empleo
            decente, Ley de MYPE (D.S Nº 0007-2008-TR), concordante con su Reglamento (D.S Nº 008-2008-TR) y de su
            Normatividad de integración lo dispuesto en el Decreto Legislativo N° 1086; tomando en cuenta, además,
            la fe de erratas del último, publicada el 10 de julio de 2008, y la Ley N° 30056 – Ley que modifica
            diversas leyes para facilitar la inversión, impulsar el desarrollo de la micro y pequeña empresa y del
            acceso al empleo decente del 04.07.2013, legislaciones que rigen y operan en toda su esfera jurídica en
            el presente contrato a favor de las partes contratantes.
          </p>
          <p>
            1.4. El TRABAJADOR es persona natural y cuenta con una amplia experiencia como{' '}
            <b>{trabajador.cargo}</b>.
          </p>
        </Clausula>
      ),
    },
    {
      key: 'c2',
      node: (
        <Clausula titulo="CLÁUSULA SEGUNDA. - OBJETO">
          <p>
            2.1. Por el presente documento y de conformidad con lo dispuesto por el artículo 57º del TUO de la
            LPCL, EL EMPLEADOR contrata bajo la modalidad de contrato temporal por inicio de actividades a EL
            TRABAJADOR, para que desempeñe el cargo de <b>{trabajador.cargo}</b> y realice funciones propias del
            cargo, a cambio de una contraprestación convenida en la cláusula quinta del CONTRATO.
          </p>
          <p>
            2.2. EL EMPLEADOR, en ejercicio de las facultades conferidas por el artículo 9º de la Ley de
            Productividad y Competitividad Laboral, podrá establecer modificaciones en las tareas asignadas a EL
            TRABAJADOR o disponer su rotación, tomando en cuenta las necesidades del servicio a prestar, los
            requerimientos operativos del negocio y siempre que actúe dentro de los límites de la razonabilidad,
            sin que dichas variaciones signifiquen menoscabo de categoría y/o remuneración.
          </p>
          <p>
            2.3. En ese sentido, EL TRABAJADOR deberá prestar sus servicios en el lugar que le sea oportunamente
            señalado por EL EMPLEADOR y queda entendido que la prestación de servicios deberá ser efectuada de
            manera personal, no pudiendo EL TRABAJADOR ser reemplazado ni ayudado por tercera persona, debiendo
            someterse éste al cumplimiento estricto de la labor para la cual ha sido contratado y a las directivas
            que emanen de EL EMPLEADOR y/o sus representantes.
          </p>
        </Clausula>
      ),
    },
    {
      key: 'c3',
      node: (
        <Clausula titulo="CLÁUSULA TERCERA. - PLAZO DEL CONTRATO">
          <p>
            3.1. El plazo de duración del presente CONTRATO es de <b>{contrato.plazoTexto}</b>, que se hará
            efectivo a partir del <b>{fechaInicioLarga}</b> hasta el <b>{fechaFinLarga}</b>, sin necesidad de
            preaviso y pudiendo cualquiera de las partes ponerle término en la forma que señala el Texto Único
            Ordenado del Decreto Legislativo N° 728, de la Ley de Productividad y Competitividad Laboral, aprobado
            por Decreto Supremo N° 003-97-TR o la norma legal que lo sustituya en el momento en que se produzca la
            terminación del contrato.
          </p>
          <p>
            3.2. Queda entendido que EL EMPLEADOR no está obligado a dar aviso adicional alguno referente al
            vencimiento del presente contrato, el que operará en la fecha señalada en el párrafo anterior. Al
            término del contrato, EL EMPLEADOR le abonará a EL TRABAJADOR, los beneficios sociales que pudieran
            corresponderle, los que tienen el carácter de cancelatorios.
          </p>
          <p>
            3.3. Por su parte, EL TRABAJADOR deberá poner a disposición de EL EMPLEADOR en la fecha de vencimiento
            del presente contrato, el cargo o las labores que venía desempeñando y entregar las instalaciones y
            bienes de propiedad de EL EMPLEADOR, que se le hayan asignado.
          </p>
        </Clausula>
      ),
    },
    {
      key: 'c4',
      node: (
        <Clausula titulo="CLÁUSULA CUARTA. - JORNADA DE TRABAJO">
          <p>
            4.1. LAS PARTES estipulan que la jornada laboral de EL TRABAJADOR será una jornada atípica de{' '}
            <b>{contrato.jornadaTexto}</b>, con un horario que será establecido y comunicado por EL EMPLEADOR de
            acuerdo con el requerimiento que realice el cliente. Asimismo, EL EMPLEADOR puede realizar
            modificaciones en su jornada de trabajo, reduciéndose según las necesidades de la jefatura, servicio
            y/o área en la que ingrese a laborar, sea trasladado en el futuro por cambios internos, destaques,
            reducción o cierre del negocio.
          </p>
          <p>
            4.2. En uso de sus facultades directrices, EL EMPLEADOR está facultado a efectuar modificaciones
            razonables en la jornada de trabajo de acuerdo con sus necesidades operativas respetando el máximo
            legal de 48 horas semanales, sin que dichas variaciones signifiquen menoscabo de categoría y/o
            remuneración.
          </p>
          <p>
            4.3. EL EMPLEADOR puede realizar modificaciones en su jornada de trabajo, reduciéndose según las
            necesidades de la jefatura, servicio y/o área en la que ingrese a laborar, sea trasladado en el futuro
            por cambios internos, destaques, reducción o cierre del negocio.
          </p>
          <p>
            4.4. EL EMPLEADOR realizará las modificaciones de la jornada y horario de trabajo que requiera; en caso
            de una reducción de horas, esta no producirá reducción alguna de la remuneración básica que percibe EL
            TRABAJADOR o, en caso de un aumento de horas o días en campo serán compensados por días de descanso,
            esta no generará un aumento de la remuneración mensual percibida.
          </p>
          <p>
            4.5. EL EMPLEADOR informará los cambios realizados por medio de un representante directo pudiendo ser:
            de la jefatura, supervisores, área de planeamiento, área de recursos humanos y/o área que se designe
            para tal fin, utilizando los medios o dispositivos electrónicos de uso común dentro de las labores
            efectivas de EL TRABAJADOR tales como: correo electrónico, aplicativos como WhatsApp, Telegram, u otros
            generalmente empleados en sus labores diarias. EL TRABAJADOR tiene conocimiento y acepta que cualquier
            modalidad de comunicación determinada por EL EMPLEADOR será considerada válida.
          </p>
          <p>
            4.6. EL EMPLEADOR lleva a cabo un mecanismo de control y medición del cumplimiento de la jornada de
            trabajo asignada a EL TRABAJADOR. Por lo tanto, las ausencias al trabajo de manera injustificada por
            parte de EL TRABAJADOR, implican el no pago de la remuneración de manera proporcional al tiempo de
            ausencia o la no realización de labor efectiva; sin perjuicio del ejercicio de las facultades
            disciplinarias propias de EL EMPLEADOR previstas en la legislación laboral y en las normas internas,
            expresando EL TRABAJADOR su conformidad al momento de la suscripción del presente contrato.
          </p>
          <p>
            4.7. Que, en caso EL TRABAJADOR al término de su jornada de trabajo en campo, requiera ausentarse de la
            zona asignada, deberá solicitar la autorización correspondiente a EL EMPLEADOR a través de cualquier
            medio electrónico de uso común de las labores efectivas, tales como: WhatsApp o correo electrónico.
          </p>
        </Clausula>
      ),
    },
    {
      key: 'c5',
      node: (
        <Clausula titulo="CLÁUSULA QUINTA. - CONTRAPRESTACIÓN">
          <p>
            5.1. EL TRABAJADOR percibirá como contraprestación por sus servicios una remuneración mensual neta
            ascendente a <b>S/. {montoFormateado}</b> ({montoLetras}). EL EMPLEADOR asumirá los pagos que por ley
            se encuentran a cargo de EL TRABAJADOR.
          </p>
          <p>
            5.2. Las ausencias injustificadas por parte de EL TRABAJADOR implican la pérdida de la remuneración
            proporcionalmente a la duración de dicha ausencia, sin perjuicio del ejercicio de las facultades
            disciplinarias propias de EL EMPLEADOR previstas en la legislación laboral y normas internas de EL
            EMPLEADOR.
          </p>
          <p>
            5.3. LAS PARTES dejan claramente establecido que la contraprestación pactada podrá ser objeto de
            incremento, de acuerdo a lo que establezcan las normas laborales que se dicten en su oportunidad o la
            política remunerativa de EL EMPLEADOR, no siendo necesaria la redacción y suscripción de cláusula
            modificatoria adicional.
          </p>
        </Clausula>
      ),
    },
    {
      key: 'c6',
      node: (
        <Clausula titulo="CLÁUSULA SEXTA. – OBLIGACIONES DE EL EMPLEADOR">
          <p>
            6.1. El EMPLEADOR se obliga a otorgar al TRABAJADOR todos los beneficios remunerativos y sociales que
            le corresponden como trabajador de acuerdo a Ley y al CONTRATO.
          </p>
          <p>
            6.2. Los beneficios sociales que correspondan a EL TRABAJADOR por la extinción del CONTRATO, tendrán
            efecto cancelatorio de acuerdo a la legislación vigente.
          </p>
          <p>
            6.3. EL EMPLEADOR se obliga a facilitar a EL TRABAJADOR los medios y materiales necesarios para que
            preste el servicio específico materia del CONTRATO.
          </p>
          <p>
            6.4. EL EMPLEADOR, se compromete a efectuar diversos gastos con la finalidad que EL TRABAJADOR se
            encuentre en condiciones de iniciar las labores encomendadas, asumiendo los gastos siguientes:
          </p>
          <ul className="ml-5 list-disc">
            <li>Examen médico S/ {examenMedico.toFixed(2)} soles</li>
            <li>Cursos con certificación S/ {cursos.toFixed(2)} soles</li>
            <li>Seguros SCTR y Vida Ley S/ {seguros.toFixed(2)} soles</li>
          </ul>
        </Clausula>
      ),
    },
    {
      key: 'c7',
      node: (
        <Clausula titulo="CLÁUSULA SÉPTIMA. - MODIFICACIONES EN LAS CONDICIONES LABORALES">
          <p>
            EL TRABAJADOR desarrollará sus funciones en los centros de labores que EL EMPLEADOR determine. Ésta
            indicará de manera oportuna el centro de labores asignado, sin perjuicio de las visitas que EL
            TRABAJADOR tenga que realizar a cualquiera de los otros centros de labores de EL EMPLEADOR. Asimismo, y
            en ejercicio legítimo de su poder de dirección, EL EMPLEADOR podrá variar el centro de labores asignado
            a EL TRABAJADOR, pudiendo incluso asignar a EL TRABAJADOR a cumplir sus funciones fuera de las
            instalaciones de los centros de laborales de EL EMPLEADOR o en las instalaciones de sus clientes, sin
            que dicha variación signifique un perjuicio o una afectación a la naturaleza de las labores a su cargo.
            En ese sentido, el presente contrato no implica un pacto de ubicación geográfica permanente, de manera
            tal que EL EMPLEADOR podrá cambiar el centro de trabajo asignado, en función a la capacidad y aptitud
            de EL TRABAJADOR, así como a las necesidades y requerimientos de EL EMPLEADOR y/o Cliente, sin que
            dichas variaciones signifiquen rebaja de categoría y/o remuneración.
          </p>
        </Clausula>
      ),
    },
    {
      key: 'c8',
      node: (
        <Clausula titulo="CLÁUSULA OCTAVA. - OBLIGACIONES DE EL TRABAJADOR">
          <p>
            8.1. Por el presente instrumento, EL EMPLEADOR contrata a EL TRABAJADOR, para que se desempeñe como{' '}
            <b>{trabajador.cargo}</b>, asumiendo las funciones, obligaciones y responsabilidades propias de dicho
            cargo y otras funciones que disponga la Gerencia General.
          </p>
          <p>
            8.2. EL TRABAJADOR se compromete a realizar los servicios contratados de acuerdo a las funciones,
            obligaciones y responsabilidades propias del cargo, con lealtad y eficiencia, eficacia y calidad,
            aplicando para tal fin toda su experiencia y capacidad, y velando por los intereses de EL EMPLEADOR.
            Asimismo, deberá ejercer las funciones propias de su cargo con la mayor diligencia y responsabilidad.
          </p>
          <p>
            8.3. EL TRABAJADOR deberá cumplir con las normas propias del Centro de Trabajo, así como las contenidas
            en el Reglamento Interno de Trabajo y en las demás normas laborales, y las que se impartan por
            necesidades del servicio en ejercicio de las facultades de administración de EL EMPLEADOR, de
            conformidad con el artículo 9º del TUO del D. Leg. Nº 728 aprobado por D. S. Nº 003-97-TR Ley de
            Productividad y Competitividad Laboral.
          </p>
          <p>
            8.4. EL TRABAJADOR, asume plena responsabilidad por el uso adecuado, custodia y operatividad de todos
            los bienes y servicios que le sean entregados a su cargo, para la adecuada realización de sus labores.
            Los bienes y servicios entregados se utilizarán exclusivamente por EL TRABAJADOR para el cumplimiento
            de sus funciones y actividades laborales, asimismo EL TRABAJADOR se obliga en reponer los daños en los
            bienes y servicios causados a las embarcaciones, ya sea por negligencia, imprudencia o impericia y que
            como parte del cobro acepta que se le descuente en su liquidación.
          </p>
          <p>
            8.5. Cumplir con todos los requisitos de salud ocupacional exigidos por EL EMPLEADOR para el
            cumplimiento del objeto del CONTRATO descritos en la cláusula segunda del CONTRATO, sometiéndose a los
            exámenes médicos respectivos a fin de determinar si se encuentra APTO médica y psicológicamente.
          </p>
          <p>
            8.6. Mantener en secreto toda información que llegue a su conocimiento en relación a los negocios del
            EMPLEADOR de acuerdo a lo previsto en el presente CONTRATO y bajo sanción de persecución penal por el
            delito previsto en el artículo 165º del Código Penal Peruano.
          </p>
          <p>8.7. Asistir a las Capacitaciones de Seguridad y Salud en el Trabajo internas y/o externas programadas por EL EMPLEADOR.</p>
          <p>
            8.8. Observar y cumplir el Reglamento Interno de Seguridad y Salud en el Trabajo, y otras directivas
            que EL EMPLEADOR le imparta en armonía con el artículo 9º del Texto Único Ordenado de la Ley de
            Productividad y Competitividad Laboral, aprobado por Decreto Supremo Nº 003-97-TR.
          </p>
          <p>
            8.9. Reconocer la propiedad y no duplicación de manuales, documentos, equipos etc. Que forman parte de
            la propiedad de EL EMPLEADOR. Estos serán cuidados y podrán ser utilizados bajo el consentimiento por
            escrito del gerente general.
          </p>
          <p>8.10. Cumplir con los horarios de trabajo establecidos en este documento pudiendo ser requerido viajes al interior o fuera del país.</p>
          <p>8.11. No se podrá ejercer otro empleo sin el consentimiento por escrito del Gerente General.</p>
          <p>
            8.12. EL TRABAJADOR, se compromete a cumplir las labores encomendadas por el plazo establecido en el
            presente contrato, no obstante, si por alguna razón decidiera renunciar antes del plazo establecido,
            asumirá los gastos efectuados por EL EMPLEADOR, conforme a lo señalado en el numeral 6.4 de la cláusula
            sexta del presente contrato, en un equivalente al <b>CINCUENTA (50%) POR CIENTO DEL TOTAL DE LOS
            GASTOS EFECTUADOS</b>, el cual acepta que será descontado de su remuneración total por los días
            trabajados.
          </p>
        </Clausula>
      ),
    },
    {
      key: 'c9',
      node: (
        <Clausula titulo="CLÁUSULA NOVENA. - CAUSALES DE EXTINCIÓN DEL CONTRATO">
          <p>Son causales de extinción del CONTRATO las siguientes:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>El fallecimiento de EL TRABAJADOR.</li>
            <li>La renuncia o retiro voluntario del TRABAJADOR.</li>
            <li>Mutuo disenso entre EL TRABAJADOR y EL EMPLEADOR.</li>
            <li>Invalidez absoluta y permanente declarada por el Seguro Social de Salud – ESSALUD o los servicios previsionales.</li>
            <li>Acogerse a la jubilación de acuerdo a Ley.</li>
            <li>El despido del TRABAJADOR en los casos y con las formalidades permitidas por la normatividad laboral correspondiente.</li>
            <li>El cese colectivo en los casos y formas establecidas por Ley.</li>
            <li>Por sentencia judicial ejecutoriada que declara la nulidad de un despido y EL TRABAJADOR opta por la indemnización.</li>
            <li>Por sentencia judicial consentida que imponga pena privativa de la libertad.</li>
            <li>La terminación de la relación laboral en los casos y formas permitidas por la Ley.</li>
            <li>La comisión de falta grave.</li>
          </ul>
        </Clausula>
      ),
    },
    {
      key: 'c10',
      node: (
        <Clausula titulo="CLÁUSULA DÉCIMA. - EXCLUSIVIDAD Y BUENA FE LABORAL">
          <p>
            10.1. Los servicios que se contratan tienen carácter de exclusivos por lo que EL TRABAJADOR no podrá
            desempeñar otra actividad comercial o laboral que sea igual, similar o complementaria al giro o
            actividad de EL EMPLEADOR.
          </p>
          <p>
            10.2. LAS PARTES convienen expresamente que el desempeño, por parte de EL TRABAJADOR, de cualquier
            actividad sea igual, similar o complementaria al giro de EL EMPLEADOR, deberá requerir autorización
            expresa previa de EL EMPLEADOR o comunicada por EL TRABAJADOR si se hubiese iniciado con anterioridad a
            la suscripción del CONTRATO.
          </p>
          <p>10.3. La falta de autorización y/o comunicación de dicha actividad en su debida oportunidad será considerada como falta grave.</p>
          <p>
            10.4. EL TRABAJADOR se obliga, en forma expresa, a poner al servicio del EMPLEADOR toda su capacidad,
            diligencia, lealtad y a guardar confidencialidad en asuntos que conozca con ocasión de la prestación de
            sus servicios, sometiéndose a las directivas que se le impartan para el mejor cumplimiento de sus
            obligaciones de trabajo.
          </p>
        </Clausula>
      ),
    },
    {
      key: 'c11',
      node: (
        <Clausula titulo="CLÁUSULA DÉCIMO PRIMERA. - RECOMENDACIONES GENERALES EN MATERIA DE SEGURIDAD Y SALUD RELACIONADAS CON EL PUESTO DE TRABAJO">
          <p>
            11.1. Conforme a lo establecido por el literal c) del artículo 35° y artículo 52° de la Ley N° 29783,
            Ley de Seguridad y Salud en el Trabajo, y el artículo 30° del Decreto Supremo N° 005-2012-TR,
            Reglamento de la Ley de Seguridad y Salud en el Trabajo, EL TRABAJADOR debe observar y cumplir con las
            siguientes recomendaciones de Seguridad y Salud en el Trabajo:
          </p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Usar adecuadamente los instrumentos y materiales de trabajo, así como los equipos de protección personal diseñados especialmente para su puesto de trabajo siempre y cuando haya sido previamente informado y capacitado sobre su uso.</li>
            <li>No operar ni manipular equipos, maquinarias, herramientas u otros elementos para los cuales no haya sido autorizado ni capacitado.</li>
            <li>Someterse a los exámenes médicos ocupacionales a fin de prevenir y/o detectar alguna afectación a la salud.</li>
            <li>Observar por las políticas internas de SST de la Asociación.</li>
            <li>Reportar inmediatamente cualquier accidente e incidente de trabajo a su jefe superior inmediato y este a la alta dirección de la Asociación.</li>
            <li>Cumplir con las normas, reglamentos e instrucciones de los programas de seguridad y salud en el trabajo.</li>
            <li>Usar adecuadamente los instrumentos y materiales de trabajo, así como los equipos de protección personal y colectiva, siempre y cuando hayan sido previamente informados y capacitados sobre su uso.</li>
            <li>Cooperar y participar en el proceso de investigación de los accidentes de trabajo y de las enfermedades ocupacionales cuando la autoridad competente lo requiera o cuando, a su parecer, los datos que conocen ayuden al esclarecimiento de las causas que los originaron.</li>
            <li>Participar en los organismos paritarios, en los programas de capacitación y otras actividades destinadas a prevenir los riesgos laborales que organice la Asociación o la autoridad administrativa de trabajo, dentro de la jornada de trabajo.</li>
            <li>Comunicar a EL EMPLEADOR todo evento o situación que ponga o pueda poner en riesgo su seguridad y salud o las instalaciones físicas, debiendo adoptar inmediatamente, de ser posible, las medidas correctivas del caso sin que genere sanción de ningún tipo.</li>
            <li>Responder e informar con veracidad a las instancias públicas que se lo requieran, caso contrario es considerado falta grave sin perjuicio de la denuncia penal correspondiente.</li>
            <li>Otras que establezcan las normas imperativas, las normas internas de EL EMPLEADOR.</li>
          </ul>
          <p>
            11.2. Asimismo, LAS PARTES declaran que el documento “Recomendaciones de Seguridad y Salud en el
            Trabajo” señalado en el párrafo anterior figura como ANEXO No. 1, el cual debidamente suscrito por EL
            EMPLEADOR y EL TRABAJADOR forma parte integrante del presente contrato de trabajo.
          </p>
        </Clausula>
      ),
    },
    {
      key: 'c12',
      node: (
        <Clausula titulo="CLÁUSULA DÉCIMO SEGUNDA. - USO DE BIENES DE TRABAJO">
          <p>
            12.1. Los medios de trabajo proporcionados por EL EMPLEADOR deberán ser utilizados por EL TRABAJADOR
            exclusivamente para el cumplimiento de las funciones asignadas por EL EMPLEADOR en virtud del presente
            Contrato, reconociendo expresamente que no pueden ser empleados para asuntos ajenos a sus funciones.
          </p>
          <p>
            12.2. En especial, EL TRABAJADOR declara conocer que no podrá emplear los bienes y servicios de EL
            EMPLEADOR para adherirse o difundir comunicados que sean ilegales o que violen cualquier política de EL
            EMPLEADOR, en especial aquellos que sean difamatorios, obscenos, racistas, sexistas o que ofendan
            creencias religiosas.
          </p>
        </Clausula>
      ),
    },
    {
      key: 'c13',
      node: (
        <Clausula titulo="CLÁUSULA DÉCIMO TERCERA. - PROTECCIÓN DE LOS DATOS PERSONALES">
          <p>
            13.1. Durante la vigencia de la relación laboral y en virtud de esta, EL TRABAJADOR se encuentra
            obligado a proporcionar, remitir y/o entregar información de carácter personal a EL EMPLEADOR, la misma
            que ingresará y permanecerá almacenada en su base de datos, lo cual EL TRABAJADOR autoriza a EL
            EMPLEADOR a utilizar dicha información para todos aquellos fines vinculados con la prestación de sus
            servicios y la ejecución de sus labores, en el marco de la presente relación laboral.
          </p>
          <p>
            13.2. Por su parte, EL EMPLEADOR declara que el tratamiento de los datos personales de EL TRABAJADOR se
            efectuará en estricta observancia de los derechos fundamentales de éste, y, en particular, respetando
            rigurosamente las disposiciones contenidas en la Ley N° 29733 – Ley de Protección de Datos Personales y
            su reglamento, aprobado mediante Decreto Supremo N° 003-2013-JUS. Adicionalmente, EL EMPLEADOR se
            obliga adoptar las medidas y mecanismos que resulten necesarios para proteger los datos personales de
            EL TRABAJADOR, de conformidad con los dispositivos normativos antes citados.
          </p>
        </Clausula>
      ),
    },
    {
      key: 'c14',
      node: (
        <Clausula titulo="CLÁUSULA DÉCIMO CUARTA. - CONFIDENCIALIDAD">
          <p>
            14.1. EL TRABAJADOR se compromete a guardar total y absoluta reserva respecto de todas las
            informaciones y datos sobre las cuales haya tomado conocimiento, en forma directa y/o indirecta, con
            ocasión de su relación de trabajo con EL EMPLEADOR. Tal información no deberá utilizarla en beneficio
            propio o de terceros.
          </p>
          <p>
            14.2. La obligación a que se refiere el párrafo anterior subsistirá de forma indefinida después de
            finalizado el presente contrato. En consecuencia, EL TRABAJADOR responderá por los daños y perjuicios
            que pudiesen derivarse para EL EMPLEADOR o cualquier otra persona natural o jurídica como resultado de
            la violación a la obligación de reserva asumida en virtud de la presente cláusula.
          </p>
          <p>
            14.3. EL TRABAJADOR tiene prohibido transmitir a terceros, excepto por razones de servicio, cualquier
            información relacionada con el funcionamiento de EL EMPLEADOR, y de sus clientes, sus proveedores, su
            metodología técnica y comercial y en general cualquier información que pueda causarle perjuicio a EL
            EMPLEADOR.
          </p>
          <p>
            14.4. EL TRABAJADOR no podrá retener documentos relativos a las actividades de EL EMPLEADOR en su
            posesión. Más aún, en caso se trate de un secreto comercial perteneciente a EL EMPLEADOR, su
            divulgación será sancionada por la ley (artículo 165 del Código Penal Peruano).
          </p>
        </Clausula>
      ),
    },
    {
      key: 'c15',
      node: (
        <Clausula titulo="CLÁUSULA DÉCIMO QUINTA. - DEVOLUCIÓN DE MATERIALES DE TRABAJO">
          <p>
            15.1. LAS PARTES, acuerdan que, si las funciones de EL TRABAJADOR ameritan la entrega de elementos o
            accesorios necesarios para desarrollar su labor, se levantará un acta de entrega de elementos o
            accesorios.
          </p>
          <p>
            15.2. La pérdida o maltrato intencional de estos accesorios hará incurrir a EL TRABAJADOR en la
            obligación de ponerlos al costo actualizado de acuerdo a la determinación que efectúe EL EMPLEADOR. Si
            por causas relacionadas directamente con su actividad se produjera un deterioro en sus accesorios de
            trabajo, estos serán reemplazados por otros accesorios de iguales características.
          </p>
          <p>
            15.3. EL TRABAJADOR se obliga, con ocasión del cese, a entregar de forma inmediata y ordenada a EL
            EMPLEADOR de toda documentación, material técnico o comercial y cualquier otro bien de propiedad de EL
            EMPLEADOR que tuviese en su poder. En dicha oportunidad se verificará el estado de conservación en que
            se le entregó el bien, tomando en consideración el desgaste producido por su uso normal.
          </p>
        </Clausula>
      ),
    },
    {
      key: 'c16',
      node: (
        <Clausula titulo="CLÁUSULA DÉCIMO SEXTA. - FIRMA DIGITALIZADA Y EMPLEO DE TECNOLOGÍAS DE LA INFORMACIÓN Y COMUNICACIÓN">
          <p>
            16.1. Mediante EL CONTRATO, LAS PARTES acuerdan que EL EMPLEADOR podrá consignar la firma digitalizada
            de su apoderado con facultades suficientes en los documentos de índole laboral (constancias de CTS,
            constancias de Impuestos a la Renta, constancia de pago de utilidades, boletas de pago, declaraciones
            juradas de domicilio, ficha de ingreso, entre otros) de EL TRABAJADOR, conforme a lo establecido en el
            artículo 141-A del Código Civil Peruano.
          </p>
          <p>
            16.2. Asimismo, LAS PARTES acuerdan que la entrega de los documentos de índole laboral (constancias de
            CTS, constancias de Impuestos a la Renta, constancia de pago de utilidades, boletas de pago,
            declaraciones juradas de domicilio, ficha de ingreso, entre otros) se podrán efectuar a través del
            empleo de tecnologías de la información y comunicación, tales como, intranet, correo electrónico, u
            otros de similar naturaleza. El envío de los documentos de índole laboral a través del correo
            electrónico se realizará a la dirección del correo corporativo de cada trabajador y/o a la dirección
            del correo personal brindado por EL TRABAJADOR a EL EMPLEADOR.
          </p>
        </Clausula>
      ),
    },
    {
      key: 'c17',
      node: (
        <Clausula titulo="CLÁUSULA DÉCIMO SÉPTIMA. - RÉGIMEN LABORAL APLICABLE">
          <p>
            17.1. EL TRABAJADOR está sujeto al Régimen Laboral de la Actividad Privada, dentro de los alcances y
            efectos que determine la Ley de Productividad y Competitividad Laboral y demás normas complementarias
            y modificatorias para los trabajadores que cuentan con contrato de Trabajo sujeto a modalidad por
            incremento de actividad y les sean aplicables los derechos y beneficios previstos para dichos
            trabajadores en las normas legales aplicables.
          </p>
          <p>
            17.2. Asimismo, al ser EL EMPLEADOR una Microempresa que opera al amparo de la Decreto Legislativo N°
            1086 – Ley de Promoción de la Competitividad, Formalización y Desarrollo de la Micro y Pequeña Empresa
            y del Acceso al Empleo Decente, D. S. N° 007 – 2008 – TR- TUO de la Ley de promoción de la
            competitividad, formalización y desarrollo de la micro y pequeña empresa y del acceso al empleo
            decente, D. S. Nº 0008-2008-TR – Reglamento del TUO de la Ley de promoción de la competitividad,
            formalización y desarrollo de la micro y pequeña empresa y del acceso al empleo decente – Reglamento de
            la Ley MYPE, y la Ley N° 30056 – Ley que modifica diversas leyes para facilitar la inversión, impulsar
            el Desarrollo de la Micro y Pequeña Empresa y del Acceso al Empleo Decente del 04.07.2013, EL
            TRABAJADOR está sujeto al Régimen Laboral de la Microempresa que establece las citadas normas
            imperativas.
          </p>
        </Clausula>
      ),
    },
    {
      key: 'c18',
      node: (
        <Clausula titulo="CLÁUSULA DÉCIMO OCTAVA. – SOLUCIÓN DE CONTROVERSIAS">
          <p>
            LAS PARTES contratantes acuerdan ceñirse fielmente a lo especificado en el presente contrato, asimismo,
            LAS PARTES convienen que en caso de producirse alguna controversia o discrepancia o reclamación entre
            ellas en relación al contrato, estas serán solucionadas en primer orden de manera coordinada y
            conjunta, brindando sus mayores esfuerzos para lograr soluciones armoniosas, en segundo orden a través
            de una conciliación extrajudicial y como tercer orden la vía judicial de la Jurisdicción de{' '}
            <b>{contrato.jurisdiccion}</b>.
          </p>
        </Clausula>
      ),
    },
    {
      key: 'closing',
      node: (
        <>
          <p className="mb-10 mt-6 text-justify text-[12.5px] leading-relaxed">
            Como muestra de conformidad con todas las cláusulas del presente contrato firman las partes por
            triplicado el <b>{fechaFirmaLarga}</b>.
          </p>
          <div className="mt-16 grid grid-cols-2 gap-8 text-center text-[12px]">
            <div>
              <div className="mx-auto mb-1 h-16 border-b border-slate-500" />
              <div className="font-bold">GERENTE GENERAL</div>
              <div>{empleador.gerente}</div>
              <div>{empleador.gerenteDni}</div>
            </div>
            <div>
              <div className="mx-auto mb-1 h-16 border-b border-slate-500" />
              <div className="font-bold">TRABAJADOR</div>
              <div>{trabajador.nombre}</div>
              <div>{trabajador.dni}</div>
            </div>
          </div>
        </>
      ),
    },
  ]
}
