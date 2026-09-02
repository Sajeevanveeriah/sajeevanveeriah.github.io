#!/usr/bin/env python3
"""Generate Sajeevan Veeriah's public, evidence-bounded two-page resume PDF."""

from __future__ import annotations

import argparse
from io import BytesIO
from pathlib import Path

from PIL import Image as PILImage
from pypdf import PdfReader
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    Image,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


VOID = HexColor('#050509')
INK = HexColor('#111111')
MUTED = HexColor('#565861')
LINE = HexColor('#cfd3db')
PAPER = HexColor('#f5f5f4')
PANEL = HexColor('#ffffff')
SOFT = HexColor('#eef0f5')
SAPPHIRE = HexColor('#001391')
WHITE = HexColor('#ffffff')
FROST = HexColor('#f8f8f8')

DEFAULT_LOGO = Path('public/assets/image/20260827-Sajeevan-Veeriah-SV-Logo-Rev00.webp')


def draw_page(canvas, document) -> None:
    """Draw the flat paper canvas and consistent footer."""
    canvas.saveState()
    width, height = A4
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, width, height, fill=1, stroke=0)

    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.45)
    canvas.line(13 * mm, 13.5 * mm, width - 13 * mm, 13.5 * mm)
    canvas.setFillColor(MUTED)
    canvas.setFont('Courier', 6.5)
    canvas.drawString(13 * mm, 8.8 * mm, 'SAJEEVAN VEERIAH  |  PUBLIC RESUME')
    canvas.drawRightString(width - 13 * mm, 8.8 * mm, f'PAGE {document.page} OF 2')
    canvas.restoreState()


def make_styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        'header_name': ParagraphStyle(
            'HeaderName', parent=base['Normal'], fontName='Times-Roman', fontSize=27,
            leading=26.5, textColor=FROST, spaceAfter=3.5,
        ),
        'header_identity': ParagraphStyle(
            'HeaderIdentity', parent=base['Normal'], fontName='Helvetica-Bold', fontSize=10.5,
            leading=13.2, textColor=FROST, spaceAfter=6,
        ),
        'header_contact': ParagraphStyle(
            'HeaderContact', parent=base['Normal'], fontName='Helvetica', fontSize=7.8,
            leading=10.7, textColor=HexColor('#c7cad2'), spaceAfter=0,
        ),
        'continuation_name': ParagraphStyle(
            'ContinuationName', parent=base['Normal'], fontName='Times-Roman', fontSize=15,
            leading=16, textColor=FROST,
        ),
        'continuation_meta': ParagraphStyle(
            'ContinuationMeta', parent=base['Normal'], fontName='Courier', fontSize=6.9,
            leading=9, textColor=HexColor('#c7cad2'), alignment=TA_RIGHT,
        ),
        'section_index': ParagraphStyle(
            'SectionIndex', parent=base['Normal'], fontName='Courier-Bold', fontSize=7.2,
            leading=10, textColor=SAPPHIRE, letterSpacing=0.7,
        ),
        'section_title': ParagraphStyle(
            'SectionTitle', parent=base['Normal'], fontName='Times-Roman', fontSize=12.2,
            leading=13, textColor=INK, letterSpacing=-0.1,
        ),
        'profile': ParagraphStyle(
            'Profile', parent=base['Normal'], fontName='Helvetica', fontSize=9.1,
            leading=12.8, textColor=INK, spaceAfter=0,
        ),
        'body': ParagraphStyle(
            'Body', parent=base['Normal'], fontName='Helvetica', fontSize=8.55,
            leading=11.65, textColor=INK, spaceAfter=2.6,
        ),
        'compact': ParagraphStyle(
            'Compact', parent=base['Normal'], fontName='Helvetica', fontSize=8.15,
            leading=10.85, textColor=INK, spaceAfter=1.8,
        ),
        'role': ParagraphStyle(
            'Role', parent=base['Normal'], fontName='Times-Roman', fontSize=10.5,
            leading=12.2, textColor=INK, spaceAfter=1,
        ),
        'organisation': ParagraphStyle(
            'Organisation', parent=base['Normal'], fontName='Helvetica-Bold', fontSize=7.9,
            leading=10, textColor=INK, spaceAfter=1,
        ),
        'meta': ParagraphStyle(
            'Meta', parent=base['Normal'], fontName='Courier', fontSize=6.8,
            leading=8.8, textColor=MUTED, spaceAfter=2.3,
        ),
        'small': ParagraphStyle(
            'Small', parent=base['Normal'], fontName='Helvetica', fontSize=7.35,
            leading=9.7, textColor=MUTED, spaceAfter=1.7,
        ),
        'incoming_label': ParagraphStyle(
            'IncomingLabel', parent=base['Normal'], fontName='Courier-Bold', fontSize=6.8,
            leading=8.8, textColor=SAPPHIRE, letterSpacing=0.65, spaceAfter=3,
        ),
        'incoming_role': ParagraphStyle(
            'IncomingRole', parent=base['Normal'], fontName='Times-Roman', fontSize=13,
            leading=14.2, textColor=INK, spaceAfter=2,
        ),
        'incoming_org': ParagraphStyle(
            'IncomingOrg', parent=base['Normal'], fontName='Helvetica-Bold', fontSize=8.6,
            leading=10.5, textColor=INK, spaceAfter=2,
        ),
        'competency_title': ParagraphStyle(
            'CompetencyTitle', parent=base['Normal'], fontName='Helvetica-Bold', fontSize=8.1,
            leading=10.1, textColor=INK, spaceAfter=2,
        ),
        'competency_body': ParagraphStyle(
            'CompetencyBody', parent=base['Normal'], fontName='Helvetica', fontSize=7.55,
            leading=10.1, textColor=MUTED,
        ),
        'education_title': ParagraphStyle(
            'EducationTitle', parent=base['Normal'], fontName='Helvetica-Bold', fontSize=8.5,
            leading=10.8, textColor=INK, spaceAfter=1,
        ),
    }


def load_logo_flowable(logo_path: Path, max_width: float, max_height: float) -> Image:
    """Embed the exact portfolio SV monogram, cropped only to its transparent bounds."""
    with PILImage.open(logo_path) as source:
        rgba = source.convert('RGBA')
        alpha_bounds = rgba.getchannel('A').getbbox()
        if alpha_bounds is None:
            raise RuntimeError(f'Portfolio monogram has no visible pixels: {logo_path}')
        cropped = rgba.crop(alpha_bounds)
        cropped.thumbnail((192, 192), PILImage.Resampling.LANCZOS)
        width, height = cropped.size
        scale = min(max_width / width, max_height / height)
        buffer = BytesIO()
        cropped.save(buffer, format='PNG', optimize=True)
    buffer.seek(0)
    return Image(buffer, width=width * scale, height=height * scale)


def header_block(styles: dict[str, ParagraphStyle], logo_path: Path) -> Table:
    identity = [
        Paragraph('Sajeevan Veeriah', styles['header_name']),
        Paragraph('Robotics, Mechatronics, AI/ML &amp; End-To-End Automation Engineer', styles['header_identity']),
        Paragraph(
            'Geelong, Victoria, Australia | +61 498 586 654 | '
            '<link href="mailto:sajeevanveeriah@gmail.com"><font color="#c7cad2">sajeevanveeriah@gmail.com</font></link><br/>'
            '<link href="https://sajeevanveeriah.github.io"><font color="#c7cad2">sajeevanveeriah.github.io</font></link> | '
            '<link href="https://www.linkedin.com/in/sajeevan-veeriah"><font color="#c7cad2">linkedin.com/in/sajeevan-veeriah</font></link> | '
            '<link href="https://github.com/Sajeevanveeriah"><font color="#c7cad2">github.com/Sajeevanveeriah</font></link>',
            styles['header_contact'],
        ),
    ]
    logo = load_logo_flowable(logo_path, 19 * mm, 19 * mm)
    logo_tile = Table(
        [[logo]], colWidths=[24 * mm], rowHeights=[24 * mm],
        style=TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), WHITE),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('LEFTPADDING', (0, 0), (-1, -1), 2.5 * mm),
            ('RIGHTPADDING', (0, 0), (-1, -1), 2.5 * mm),
            ('TOPPADDING', (0, 0), (-1, -1), 2.5 * mm),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5 * mm),
            ('ROUNDEDCORNERS', [3 * mm]),
        ]),
    )
    return Table(
        [[identity, logo_tile]],
        colWidths=[149 * mm, 27 * mm],
        rowHeights=[34 * mm],
        style=TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), VOID),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('LEFTPADDING', (0, 0), (0, 0), 7 * mm),
            ('RIGHTPADDING', (0, 0), (0, 0), 4 * mm),
            ('TOPPADDING', (0, 0), (0, 0), 5 * mm),
            ('BOTTOMPADDING', (0, 0), (0, 0), 5 * mm),
            ('LEFTPADDING', (1, 0), (1, 0), 1.5 * mm),
            ('RIGHTPADDING', (1, 0), (1, 0), 1.5 * mm),
            ('TOPPADDING', (1, 0), (1, 0), 5 * mm),
            ('BOTTOMPADDING', (1, 0), (1, 0), 5 * mm),
        ]),
    )


def continuation_header(styles: dict[str, ParagraphStyle], logo_path: Path) -> Table:
    logo = load_logo_flowable(logo_path, 9 * mm, 9 * mm)
    logo_tile = Table(
        [[logo]], colWidths=[12 * mm], rowHeights=[12 * mm],
        style=TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), WHITE),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('LEFTPADDING', (0, 0), (-1, -1), 1.3 * mm),
            ('RIGHTPADDING', (0, 0), (-1, -1), 1.3 * mm),
            ('TOPPADDING', (0, 0), (-1, -1), 1.3 * mm),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 1.3 * mm),
            ('ROUNDEDCORNERS', [2 * mm]),
        ]),
    )
    return Table(
        [[Paragraph('Sajeevan Veeriah', styles['continuation_name']),
          Paragraph('ROBOTICS - MECHATRONICS - AI/ML - INDUSTRIAL IT/OT - AUTOMATION', styles['continuation_meta']),
          logo_tile]],
        colWidths=[54 * mm, 108 * mm, 14 * mm],
        rowHeights=[18 * mm],
        style=TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), VOID),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('LEFTPADDING', (0, 0), (0, 0), 6 * mm),
            ('RIGHTPADDING', (0, 0), (0, 0), 2 * mm),
            ('LEFTPADDING', (1, 0), (1, 0), 0),
            ('RIGHTPADDING', (1, 0), (1, 0), 3 * mm),
            ('LEFTPADDING', (2, 0), (2, 0), 0),
            ('RIGHTPADDING', (2, 0), (2, 0), 2 * mm),
            ('TOPPADDING', (0, 0), (-1, -1), 3 * mm),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3 * mm),
        ]),
    )


def section_heading(number: str, title: str, styles: dict[str, ParagraphStyle]) -> list:
    table = Table(
        [[Paragraph(number, styles['section_index']), Paragraph(title, styles['section_title'])]],
        colWidths=[13 * mm, 163 * mm],
        style=TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'BOTTOM'),
            ('LINEBELOW', (0, 0), (-1, -1), 0.55, LINE),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 0),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 2.2 * mm),
        ]),
    )
    return [Spacer(1, 2.8 * mm), table, Spacer(1, 1.8 * mm)]


def bullet(text: str, styles: dict[str, ParagraphStyle], compact: bool = True) -> Paragraph:
    style = styles['compact'] if compact else styles['body']
    return Paragraph(f'- {text}', style)


def incoming_block(styles: dict[str, ParagraphStyle]) -> Table:
    content = [
        Paragraph('INCOMING APPOINTMENT - CONTRACT PENDING', styles['incoming_label']),
        Paragraph('Industrial IT Engineer - IT Systems / MES / ERP', styles['incoming_role']),
        Paragraph('Farm Frites Australia | Dooen, Victoria', styles['incoming_org']),
        Paragraph(
            'Planned appointment. Employment has not commenced; the final public title and commencement date remain subject to the issued contract.',
            styles['small'],
        ),
        bullet('Role scope includes MES implementation and production workflows, ERP integration, SCADA/PLC/historian interfaces, OT infrastructure and production-data integrity.', styles),
        bullet('The position also covers commissioning, validation, traceability, vendor coordination, cybersecurity, documentation and cross-functional support across Operations, Engineering, Quality, Supply Chain and IT.', styles),
    ]
    return Table(
        [[content]], colWidths=[176 * mm],
        style=TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), SOFT),
            ('LINEBEFORE', (0, 0), (0, 0), 2.2, SAPPHIRE),
            ('BOX', (0, 0), (-1, -1), 0.45, LINE),
            ('LEFTPADDING', (0, 0), (-1, -1), 5 * mm),
            ('RIGHTPADDING', (0, 0), (-1, -1), 5 * mm),
            ('TOPPADDING', (0, 0), (-1, -1), 4.2 * mm),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5 * mm),
        ]),
    )


def competency_cell(title: str, text: str, styles: dict[str, ParagraphStyle]) -> list:
    return [Paragraph(title, styles['competency_title']), Paragraph(text, styles['competency_body'])]


def competency_grid(styles: dict[str, ParagraphStyle]) -> Table:
    rows = [
        [
            competency_cell('Industrial IT, OT and Automation', 'PLC and HMI/SCADA integration, MES exposure, production-data interfaces, field devices, drives, industrial networks, FAT, SAT and commissioning.', styles),
            competency_cell('Robotics and Mechatronics', 'ROS 2 Humble, Nav2, MoveIt 2, Gazebo Fortress, SLAM, EKF sensor fusion, localisation, planning, motion control and physical prototyping.', styles),
        ],
        [
            competency_cell('Embedded Systems and Connectivity', 'ESP32, STM32, FreeRTOS, C/C++, PCB bring-up, CAN, UART, I2C, SPI, BLE, LoRaWAN, MQTT and Linux services.', styles),
            competency_cell('AI/ML, Data and Engineering Software', 'Python, scikit-learn, OpenCV, YOLO, time-series analysis, MATLAB, Simulink, TypeScript, React, Rust, SQL and CI/CD.', styles),
        ],
        [
            competency_cell('Verification and Delivery', 'Requirements, instrumentation, calibrated testing, regression, fault isolation, data integrity, traceable QA, validation and technical handover.', styles),
            competency_cell('Manufacturing and Quality', 'GMP, food and beverage operations, traceability, batch discipline, process troubleshooting, ITP/MDR records, WHS and regulated evidence.', styles),
        ],
    ]
    return Table(
        rows, colWidths=[88 * mm, 88 * mm],
        style=TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), PANEL),
            ('BOX', (0, 0), (-1, -1), 0.45, LINE),
            ('INNERGRID', (0, 0), (-1, -1), 0.35, LINE),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 4 * mm),
            ('RIGHTPADDING', (0, 0), (-1, -1), 4 * mm),
            ('TOPPADDING', (0, 0), (-1, -1), 3.2 * mm),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3.2 * mm),
        ]),
    )


def experience_block(
    role: str,
    organisation: str,
    period: str,
    context: str,
    bullets: list[str],
    styles: dict[str, ParagraphStyle],
) -> KeepTogether:
    heading = Table(
        [[Paragraph(role, styles['role']), Paragraph(period, styles['meta'])]],
        colWidths=[130 * mm, 46 * mm],
        style=TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 0),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
        ]),
    )
    items = [heading, Paragraph(organisation, styles['organisation']), Paragraph(context, styles['meta'])]
    items.extend(bullet(item, styles) for item in bullets)
    items.append(Spacer(1, 1.7 * mm))
    return KeepTogether(items)


def early_experience_block(styles: dict[str, ParagraphStyle]) -> KeepTogether:
    return KeepTogether([
        Paragraph('Manufacturing, Commissioning and Quality Foundation', styles['role']),
        Paragraph('IDL Australia | Carbon Revolution | Thornton Engineering Australia', styles['organisation']),
        Paragraph('2018 - 2024 | Food and beverage, carbon-fibre and structural-steel production', styles['meta']),
        bullet('Built practical experience in equipment operation, changeovers, safe production, first-response fault recovery, process discipline, batch quality and traceability.', styles),
        bullet('Supported drawing review, ITP/MDR documentation, material traceability, QA inspection, equipment trials and commissioning checks across workshop and production environments.', styles),
        Spacer(1, 1.7 * mm),
    ])


def project_block(title: str, evidence: str, detail: str, styles: dict[str, ParagraphStyle]) -> KeepTogether:
    return KeepTogether([
        Paragraph(title, styles['role']),
        Paragraph(evidence, styles['meta']),
        Paragraph(detail, styles['compact']),
        Spacer(1, 1.3 * mm),
    ])


def simple_record(title: str, body: str, styles: dict[str, ParagraphStyle]) -> KeepTogether:
    return KeepTogether([
        Paragraph(title, styles['education_title']),
        Paragraph(body, styles['compact']),
        Spacer(1, 1.4 * mm),
    ])


def build_resume(output_path: Path, logo_path: Path) -> None:
    if not logo_path.is_file():
        raise FileNotFoundError(f'Portfolio monogram not found: {logo_path}')

    styles = make_styles()
    document = SimpleDocTemplate(
        str(output_path), pagesize=A4,
        leftMargin=17 * mm, rightMargin=17 * mm,
        topMargin=11 * mm, bottomMargin=18 * mm,
        title='Sajeevan Veeriah - Public Resume',
        author='Sajeevan Veeriah',
        subject='Robotics, Mechatronics, AI/ML & End-To-End Automation Engineer',
        creator='Sajeevan Veeriah portfolio resume generator',
    )

    story: list = [header_block(styles, logo_path)]

    story += section_heading('01', 'Professional Profile', styles)
    story.append(Paragraph(
        'I engineer complete systems across the physical, control, digital and operational boundary, then verify them as one working system. My practice spans robotics, industrial automation, embedded systems, industrial IT/OT, AI/ML and engineering software from requirements through integration, commissioning and handover.',
        styles['profile'],
    ))

    story += section_heading('02', 'Incoming Appointment', styles)
    story.append(incoming_block(styles))

    story += section_heading('03', 'Core Expertise', styles)
    story.append(competency_grid(styles))

    story += section_heading('04', 'Professional Experience', styles)
    story.extend([
        experience_block(
            'Automation and Controls Engineer',
            'Process automation systems integrator',
            'Jan 2026 - Jun 2026',
            'Regulated pharmaceutical, biotechnology and food production',
            [
                'Delivered PLC logic, HMI/SCADA, field-device, drive, MES and production-data integration under GMP controls.',
                'Migrated validated application content from iFIX to PVI+, completed functional checks, and supported FAT, SAT, commissioning, handover and MiR mobile-robot fault tracing.',
            ], styles,
        ),
        experience_block(
            'Product Development Test Engineer (Contract)',
            'Global automotive OEM via engineering consultancy',
            'Oct 2025 - Jan 2026',
            'Vehicle software integration and ADAS product development',
            [
                'Validated vehicle-software integration and ADAS behaviour through feature-vehicle, breadboard and regression testing.',
                'Instrumented test vehicles and used Vector CANoe and CANalyzer to capture CAN and CAN FD evidence for fault isolation and software-readiness verification.',
            ], styles,
        ),
    ])

    story.append(PageBreak())
    story.append(continuation_header(styles, logo_path))

    story += section_heading('04', 'Professional Experience Continued', styles)
    story.extend([
        experience_block(
            'Technical Officer and Quality Assurance',
            'ABMARC',
            'Jul 2024 - Aug 2025',
            'Automotive testing, energy, emissions and compliance engineering',
            [
                'Delivered ADR and EURO emissions work, EV/PHEV range testing and vehicle-systems evaluation using calibrated instrumentation, data acquisition and CAN tools.',
                'Maintained traceable QA, safety, regulatory and test records for certification review and audit.',
            ], styles,
        ),
        experience_block(
            'Consultant Engineer, IoT and Projects Administrator',
            'DuxTel',
            'Feb 2024 - Aug 2024',
            'Networking, low-power telemetry and remote asset visibility',
            [
                'Built field-to-dashboard solutions with ESP32, sensors, LoRaWAN AU915, MQTT, ChirpStack, InfluxDB and Grafana.',
                'Supported CAN and GPS capture, custom PCB work, MikroTik connectivity and Linux services from field trial through handover.',
            ], styles,
        ),
        early_experience_block(styles),
    ])

    story += section_heading('05', 'Selected Engineering Projects', styles)
    story.extend([
        project_block(
            'Open Industrial Automation',
            '2026 | Public industrial reference and simulation platform',
            'Built a deterministic mixing, dosing and CIP reference process with an operator HMI, Engineering Studio, typed project model, traceability, cybersecurity boundaries and automated verification gates.',
            styles,
        ),
        project_block(
            'Autonomous Navigation Rover on ROS 2',
            '2024 - 2025 | Hardware build with simulation-validated autonomy',
            'Built the differential-drive platform and integrated LiDAR, IMU, SLAM, EKF state estimation, Nav2 planning, control and recovery across independently testable ROS 2 nodes.',
            styles,
        ),
        project_block(
            'ESP32 Clinical Ataxia Assessment Device',
            '2025 | Honours capstone and assessed embedded prototype',
            'Designed the device, custom PCB and enclosure, implemented deterministic 100 Hz acquisition, Bluetooth live display and CSV/PDF reporting, then checked accuracy, reversal, drift and temperature behaviour against reference instruments.',
            styles,
        ),
    ])

    story += section_heading('06', 'Education', styles)
    story.extend([
        simple_record(
            'Bachelor of Mechatronics Engineering (Honours), Distinction',
            'Deakin University, Geelong | 2025 | Honours capstone: ESP32 clinical ataxia assessment device.',
            styles,
        ),
        simple_record(
            'Higher National Diploma in Mechatronics, Robotics and Automation Engineering, Distinction',
            'Cardiff Metropolitan University, United Kingdom | 2016.',
            styles,
        ),
    ])

    story += section_heading('07', 'Professional Membership', styles)
    story.append(Paragraph('<b>Member, Engineers Australia</b>', styles['compact']))

    story += section_heading('08', 'Professional Development', styles)
    story.append(Paragraph(
        'Lean Six Sigma Foundation | JIRA and Agile | KAIZEN | Industrial Automation and IIoT | AI/ML | CAD',
        styles['compact'],
    ))

    story += section_heading('09', 'Languages and Additional Information', styles)
    story.extend([
        Paragraph('<b>Languages:</b> English, Tamil and Sinhala.', styles['compact']),
        Paragraph('<b>Additional:</b> Current Victorian driver licence | Community leadership through Newcomb and District Cricket Club | Engineering mentoring and peer support.', styles['compact']),
    ])

    output_path.parent.mkdir(parents=True, exist_ok=True)
    document.build(story, onFirstPage=draw_page, onLaterPages=draw_page)

    reader = PdfReader(str(output_path))
    if len(reader.pages) != 2:
        raise RuntimeError(f'Expected 2 pages, generated {len(reader.pages)}')
    extracted = '\n'.join(page.extract_text() or '' for page in reader.pages)
    required = [
        'Sajeevan Veeriah',
        'Robotics, Mechatronics, AI/ML & End-To-End Automation Engineer',
        'Farm Frites Australia',
        'CONTRACT PENDING',
        'Professional Experience',
        'Education',
        'Professional Membership',
        'Professional Development',
        'Member, Engineers Australia',
        'Open Industrial Automation',
    ]
    missing = [item for item in required if item not in extracted]
    if missing:
        raise RuntimeError(f'Missing required resume content: {missing}')
    forbidden = [
        'Ford', 'Ford Motor Company', 'Invenio', 'JAG Process Solutions',
        '\u2013', '\u2014', 'Currently employed by Farm Frites',
    ]
    matches = [item for item in forbidden if item in extracted]
    if matches:
        raise RuntimeError(f'Forbidden public resume content: {matches}')


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--output', type=Path,
        default=Path('public/assets/Resume_Sajeevan_Veeriah.pdf'),
    )
    parser.add_argument(
        '--logo', type=Path,
        default=DEFAULT_LOGO,
        help='Exact portfolio SV monogram asset to embed.',
    )
    args = parser.parse_args()
    build_resume(args.output, args.logo)
    print(args.output)


if __name__ == '__main__':
    main()
