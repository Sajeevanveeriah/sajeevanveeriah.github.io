#!/usr/bin/env python3
"""Build the portfolio edition of my resume from reviewed content.

The portfolio edition carries no phone number, email address or social
profile links: the website's contact form is the only contact route. Career
claims follow the reviewed general resume of 18 October 2026 word for word.

Usage: python scripts/build-portfolio-resume.py [--output path]
Then validate: python scripts/generate-public-resume.py --source <output>
Requires: reportlab, pypdf, fonttools, brotli, pillow.
"""
import argparse
import tempfile
from pathlib import Path

from fontTools.ttLib import TTFont
from PIL import Image
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont as PdfFont
from reportlab.platypus import (BaseDocTemplate, Frame, KeepTogether, PageBreak, PageTemplate,
                                Paragraph, Spacer, Table, TableStyle)
from reportlab.platypus.flowables import HRFlowable

ROOT = Path(__file__).resolve().parent.parent
NAVY = HexColor('#0F1E33')
AMBER = HexColor('#F5B700')
INK = HexColor('#17212B')
MUTED = HexColor('#56616D')
RULE = HexColor('#D5DCE3')
SITE = 'https://sv.sajeevanveeriah.workers.dev'

ROLE = 'Robotics, Mechatronics, AI/ML &amp; End-To-End Automation Engineer'
FOCUS = 'MES/ERP Integration, Embedded Design &amp; Control | Applied R&amp;D'

PROFILE = ('Mechatronics engineer (Honours, Distinction) who integrated PLC/SCADA and MES systems in GMP '
           'manufacturing at JAG Process Solutions and validated vehicle software and ADAS at Ford. Since June '
           '2026, client work through Voltwyn has spanned vehicle electronics, firmware and full-stack software. '
           'Also brings industrial networking, commissioning, embedded systems, PCB design and ROS 2 robotics skills.')
STRENGTHS = ('Industrial IT/OT and MES/ERP integration | Industrial automation and controls | Robotics and autonomy | '
             'Embedded systems and PCB design | Vehicle test and validation | Software, AI/ML and data | '
             'Commissioning, quality and compliance')

SKILLS = [
    ('Industrial IT/OT and systems', 'Manufacturing execution systems (MES), ERP integration, SCADA and historian '
     'platforms, OEE, downtime and production reporting, traceability and master data, industrial networking '
     '(Ethernet, switches, servers), OT cyber security, backup and disaster recovery, system testing and '
     'validation, vendor coordination.'),
    ('Automation and controls', 'PLC logic and integration, Siemens TIA Portal, HMI/SCADA (iFIX, PVI+), drives, '
     'Modbus, PROFINET, FAT/SAT, commissioning, GMP, ITPs, MDRs and AS/NZS compliance.'),
    ('Robotics and embedded', 'ROS 2, Nav2, SLAM, EKF sensor fusion, Gazebo, RViz, C/C++, ESP32/ESP32-S3, STM32, '
     'FreeRTOS, CAN/CAN FD, UART, I2C, SPI and BLE.'),
    ('Software, AI and data', 'Python, MATLAB/Simulink, TypeScript, React, Rust (Tauri), SQL/SQLite, Git, CI/CD, '
     'OpenCV, scikit-learn and local language-model retrieval, memory and evaluation workflows.'),
    ('Hardware, IoT and test', 'Altium, KiCad, SolidWorks, Fusion 360, PCB and enclosure design, 3D printing, '
     'Linux, LoRaWAN, ChirpStack, MQTT, InfluxDB, Grafana, CANoe, CANalyzer and calibrated data acquisition.'),
]

EXPERIENCE = [
    ('Automation and Controls Engineer', 'Jan 2026 - Jun 2026', 'JAG Process Solutions', [
        'Integrated PLC logic, HMI/SCADA, field devices, drives and manufacturing execution system (MES) data for '
        'pharmaceutical, biotech and food plants.',
        'Migrated validated iFIX content to PVI+ and verified functionality; supported factory and site acceptance '
        'testing (FAT/SAT), commissioning and GMP handover evidence.',
        'Isolated MiR autonomous mobile robot faults across control, network and production interfaces to identify '
        'the responsible system layer.']),
    ('Product Development Test Engineer (Contract)', 'Oct 2025 - Jan 2026', 'Ford Motor Company via Invenio', [
        'Tested vehicle-software integration and advanced driver assistance systems (ADAS) through feature-vehicle, '
        'breadboard and regression testing.',
        'Instrumented vehicles and analysed CAN/CAN FD data in CANoe and CANalyzer to isolate faults.']),
    ('Technical Officer &amp; Quality Assurance', 'Jul 2024 - Aug 2025', 'ABMARC', [
        'Conducted emissions, EV/PHEV range and vehicle-system tests using calibrated instrumentation and data '
        'acquisition (DAQ).',
        'Maintained traceable test, safety and quality records for certification review.']),
    ('Consultant Engineer, IoT and Projects Administrator', 'Feb 2024 - Aug 2024', 'DuxTel', [
        'Built ESP32 and LoRaWAN AU915 telemetry for agricultural equipment, capturing CAN and GPS data through '
        'ChirpStack, MQTT, InfluxDB and Grafana.',
        'Integrated custom PCBs, MikroTik connectivity and Linux services for provisioning, field trials and '
        'handover.']),
]

CLIENT_PROJECTS = [
    ('Vehicle controller and display system', 'Electronics and firmware',
     'Designed a four-layer ESP32-S3 vehicle controller, serial-adapter PCB, display firmware, browser '
     'configuration and vehicle-position sensing. Prepared fabrication files; assembled-system and field '
     'validation remain pending.'),
    ('Pricing and inventory software', 'Full-stack software',
     'Developed pricing and inventory software as sole engineer (React/TypeScript, Tauri/Rust, SQLite). Built '
     'operator-reviewed imports into a job-management platform with change, exception, rollback and audit reports.'),
]

MANUFACTURING = [
    ('Production Line Worker / Supervisor / Commissioning Support; Cellar Hand', 'Aug 2022 - Feb 2024',
     'IDL Australia', [
         'Supervised production output, changeovers and handovers; maintained quality and traceability and '
         'supported canning-line commissioning to Sep 2023.',
         'From Sep 2023, supported cellar sanitation, sampling and production records.']),
    ('Production Line Operator and Commissioning Support', 'Sep 2021 - Dec 2021', 'Carbon Revolution', [
        'Operated carbon-fibre wheel equipment and maintained quality records; supported equipment trials, setup '
        'and first-level fault recovery.']),
    ('Undergraduate Quality Engineer', 'Mar 2018 - Mar 2020', 'Thornton Engineering Australia', [
        'Supported drawing review, ITPs, MDRs, material traceability and AS/NZS compliance in structural-steel '
        'fabrication.']),
]

PROJECTS = [
    ('Autonomous navigation rover', 'ROS 2 autonomy',
     'Built a differential-drive platform with LiDAR and IMU. Integrated SLAM, EKF localisation and Nav2 in '
     'C++/Python; verified navigation and recovery in Gazebo and RViz. Autonomy validated in simulation.'),
    ('Ataxia assessment device', 'Embedded mechatronics',
     'Designed an ESP32 prototype, Altium PCB and enclosure with four Hall-effect channels sampled at 100 Hz and '
     'Bluetooth reporting. Tested accuracy, reversals, drift and temperature behaviour in MATLAB.'),
    ('SPC-001 waterless solar-panel cleaner', 'Robotics',
     'Developed mechanical CAD, electronics, supervisory control and coverage planning. Wrote an independent '
     'research paper on contact mechanics, traction and energy that distinguishes analysis from physical '
     'performance.'),
    ('VeerAI', 'Local AI system',
     'Built a locally deployed language-model system with document ingestion, retrieval, memory, tools and '
     'evaluation.'),
]

EDUCATION = [
    ('Bachelor of Mechatronics Engineering (Honours), Distinction', '2025', 'Deakin University'),
    ('Higher National Diploma in Mechatronics, Robotics and Automation Engineering, Distinction', '2016',
     'Cardiff Metropolitan University'),
]

MEMBERSHIP = ('Member, Engineers Australia | English, Tamil and Sinhala | Community leadership and engineering '
              'mentoring.')


def register_fonts(workdir: Path) -> None:
    for weight, name in (('400', 'Archivo'), ('600', 'Archivo-SemiBold')):
        font = TTFont(ROOT / f'public/assets/fonts/archivo-{weight}.woff2')
        font.flavor = None
        path = workdir / f'{name}.ttf'
        font.save(path)
        pdfmetrics.registerFont(PdfFont(name, str(path)))


def styles() -> dict[str, ParagraphStyle]:
    base = ParagraphStyle('body', fontName='Archivo', fontSize=9.2, leading=12.6, textColor=INK)
    return {
        'body': base,
        'name': ParagraphStyle('name', parent=base, fontName='Archivo-SemiBold', fontSize=24, leading=28,
                               textColor=NAVY),
        'role': ParagraphStyle('role', parent=base, fontName='Archivo-SemiBold', fontSize=10.2, leading=13.4,
                               textColor=NAVY),
        'meta': ParagraphStyle('meta', parent=base, fontSize=9, leading=12.4, textColor=MUTED),
        'section': ParagraphStyle('section', parent=base, fontName='Archivo-SemiBold', fontSize=9.6, leading=12,
                                  textColor=NAVY),
        'title': ParagraphStyle('title', parent=base, fontName='Archivo-SemiBold', fontSize=9.6, leading=12.6,
                                textColor=NAVY),
        'date': ParagraphStyle('date', parent=base, fontSize=8.8, leading=12.6, textColor=MUTED,
                               alignment=TA_RIGHT),
        'org': ParagraphStyle('org', parent=base, fontSize=8.8, leading=11.6, textColor=MUTED, spaceAfter=1),
        'bullet': ParagraphStyle('bullet', parent=base, leftIndent=11, bulletIndent=2, spaceAfter=1.5),
    }


def separators(text: str) -> str:
    return text.replace(' | ', '&nbsp;&nbsp;<font color="#9AA5B1">|</font>&nbsp;&nbsp;')


def section(title: str, s, note: str = '') -> list:
    label = title.upper()
    if note:
        label += f'&nbsp;&nbsp;&nbsp;<font name="Archivo" size="8.6" color="#56616D">{note}</font>'
    head = Table([['', Paragraph(label, s['section'])]], colWidths=[1.1 * mm, None])
    head.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), AMBER),
        ('LEFTPADDING', (0, 0), (0, 0), 0), ('RIGHTPADDING', (0, 0), (0, 0), 0),
        ('LEFTPADDING', (1, 0), (1, 0), 6), ('TOPPADDING', (0, 0), (-1, -1), 1.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1.5), ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    return [Spacer(1, 7), head, HRFlowable(width='100%', thickness=0.6, color=RULE, spaceBefore=2, spaceAfter=5)]


def dated(title: str, date: str, s) -> Table:
    row = Table([[Paragraph(title, s['title']), Paragraph(date, s['date'])]], colWidths=[None, 34 * mm])
    row.setStyle(TableStyle([('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                             ('TOPPADDING', (0, 0), (-1, -1), 0), ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
                             ('VALIGN', (0, 0), (-1, -1), 'TOP')]))
    return row


def role_block(title: str, date: str, org: str, bullets: list[str], s) -> KeepTogether:
    items = [dated(title, date, s), Paragraph(org, s['org'])]
    items += [Paragraph(text, s['bullet'], bulletText='•') for text in bullets]
    items.append(Spacer(1, 4))
    return KeepTogether(items)


def project_block(title: str, kind: str, text: str, s) -> KeepTogether:
    head = f'{title}&nbsp;&nbsp;<font name="Archivo" color="#56616D">| {kind}</font>'
    return KeepTogether([Paragraph(head, s['title']), Paragraph(text, s['body']), Spacer(1, 5)])


def build(output: Path) -> None:
    with tempfile.TemporaryDirectory() as tmp:
        workdir = Path(tmp)
        register_fonts(workdir)
        monogram = workdir / 'monogram.png'
        Image.open(ROOT / 'public/assets/image/20261017-Voltwyn-Monogram-Rev00.webp').convert('RGBA').save(monogram)
        s = styles()

        def decorate(canvas, doc):
            canvas.saveState()
            width, height = A4
            canvas.setStrokeColor(RULE)
            canvas.setLineWidth(0.6)
            canvas.line(18 * mm, 14 * mm, width - 18 * mm, 14 * mm)
            canvas.setFont('Archivo', 7.6)
            canvas.setFillColor(MUTED)
            canvas.drawString(18 * mm, 10 * mm, 'Sajeevan Veeriah  |  Voltwyn  |  Portfolio edition')
            canvas.drawRightString(width - 18 * mm, 10 * mm, f'Page {doc.page} of 2')
            if doc.page == 1:
                size = 19 * mm
                canvas.drawImage(str(monogram), width - 18 * mm - size, height - 15 * mm - size,
                                 width=size, height=size, mask='auto')
            canvas.restoreState()

        doc = BaseDocTemplate(str(output), pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm,
                              topMargin=15 * mm, bottomMargin=19 * mm, title='Sajeevan Veeriah - Resume',
                              author='Sajeevan Veeriah', subject=ROLE.replace('&amp;', '&'),
                              creator='Sajeevan Veeriah portfolio', producer='ReportLab')
        frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id='body',
                      leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
        doc.addPageTemplates([PageTemplate(id='page', frames=[frame], onPage=decorate)])

        header_width = doc.width - 24 * mm
        story = [
            Table([[Paragraph('Sajeevan Veeriah', s['name'])],
                   [Paragraph(f'{ROLE} | {FOCUS}', s['role'])],
                   [Spacer(1, 3)],
                   [Paragraph(separators(f'Geelong, VIC | Portfolio and contact form: '
                                         f'<link href="{SITE}/" color="#215AD2">sv.sajeevanveeriah.workers.dev</link>'),
                              s['meta'])]],
                  colWidths=[header_width], hAlign='LEFT',
                  style=TableStyle([('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                                    ('TOPPADDING', (0, 0), (-1, -1), 0), ('BOTTOMPADDING', (0, 0), (-1, -1), 1)])),
            Spacer(1, 3),
            HRFlowable(width='100%', thickness=1.6, color=AMBER, spaceBefore=4, spaceAfter=0),
        ]
        story += section('Profile', s)
        story += [Paragraph(PROFILE, s['body']), Spacer(1, 3),
                  Paragraph(f'<font name="Archivo-SemiBold" color="#0F1E33">Core strengths:</font> '
                            f'{separators(STRENGTHS)}', s['body'])]
        story += section('Technical skills', s)
        story += [Paragraph(f'<font name="Archivo-SemiBold" color="#0F1E33">{label}:</font> {text}', s['body'],
                            ) for label, text in SKILLS]
        story += section('Professional experience', s)
        story += [role_block(*role, s) for role in EXPERIENCE]
        story.append(PageBreak())
        story += section('Voltwyn: client projects', s, '(Jun 2026 - present)')
        story += [project_block(*item, s) for item in CLIENT_PROJECTS]
        story += section('Manufacturing and quality experience', s)
        story += [role_block(*role, s) for role in MANUFACTURING]
        story += section('Selected engineering projects', s,
                         f'Full portfolio: <link href="{SITE}/work/" color="#215AD2">'
                         'sv.sajeevanveeriah.workers.dev/work</link>')
        story += [project_block(*item, s) for item in PROJECTS]
        story += section('Education', s)
        story += [KeepTogether([dated(title, year, s), Paragraph(org, s['org']), Spacer(1, 3)])
                  for title, year, org in EDUCATION]
        story += section('Membership and languages', s)
        story.append(Paragraph(separators(MEMBERSHIP), s['body']))
        doc.build(story)
    print(f'Built portfolio resume: {output}')


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, default=ROOT / 'public/assets/Resume_Sajeevan_Veeriah.pdf')
    args = parser.parse_args()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    build(args.output)


if __name__ == '__main__':
    main()
