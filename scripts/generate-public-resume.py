#!/usr/bin/env python3
"""Generate the public, evidence-bounded two-page resume PDF."""

from __future__ import annotations

import argparse
from pathlib import Path

from pypdf import PdfReader
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import KeepTogether, PageBreak, Paragraph, SimpleDocTemplate, Spacer


INK = HexColor('#000d10')
MUTED = HexColor('#4f555a')
LINE = HexColor('#d5d3d4')
CLAY = HexColor('#a8573c')


def register_fonts() -> tuple[str, str]:
    regular = Path('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')
    bold = Path('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf')
    pdfmetrics.registerFont(TTFont('ResumeSans', regular))
    pdfmetrics.registerFont(TTFont('ResumeSans-Bold', bold))
    return 'ResumeSans', 'ResumeSans-Bold'


def draw_page(canvas, document) -> None:
    canvas.saveState()
    width, _ = A4
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(16 * mm, 15 * mm, width - 16 * mm, 15 * mm)
    canvas.setFillColor(MUTED)
    canvas.setFont('ResumeSans', 7.2)
    canvas.drawString(16 * mm, 10.2 * mm, 'Sajeevan Veeriah | Public resume')
    canvas.drawRightString(width - 16 * mm, 10.2 * mm, f'Page {document.page} of 2')
    canvas.restoreState()


def make_styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        'name': ParagraphStyle(
            'Name', parent=base['Normal'], fontName='ResumeSans-Bold', fontSize=25,
            leading=24, textColor=INK, spaceAfter=4, alignment=TA_LEFT,
        ),
        'identity': ParagraphStyle(
            'Identity', parent=base['Normal'], fontName='ResumeSans-Bold', fontSize=11.2,
            leading=14, textColor=INK, spaceAfter=6,
        ),
        'contact': ParagraphStyle(
            'Contact', parent=base['Normal'], fontName='ResumeSans', fontSize=8.3,
            leading=11, textColor=MUTED, spaceAfter=11,
        ),
        'section': ParagraphStyle(
            'Section', parent=base['Normal'], fontName='ResumeSans-Bold', fontSize=9.6,
            leading=11, textColor=CLAY, spaceBefore=9, spaceAfter=5,
            uppercase=True, borderWidth=0, borderPadding=0,
        ),
        'body': ParagraphStyle(
            'Body', parent=base['Normal'], fontName='ResumeSans', fontSize=8.8,
            leading=12.1, textColor=INK, spaceAfter=4,
        ),
        'compact': ParagraphStyle(
            'Compact', parent=base['Normal'], fontName='ResumeSans', fontSize=8.45,
            leading=11.5, textColor=INK, spaceAfter=2.8,
        ),
        'role': ParagraphStyle(
            'Role', parent=base['Normal'], fontName='ResumeSans-Bold', fontSize=9.2,
            leading=11.7, textColor=INK, spaceBefore=5, spaceAfter=1,
        ),
        'meta': ParagraphStyle(
            'Meta', parent=base['Normal'], fontName='ResumeSans', fontSize=7.9,
            leading=10.4, textColor=MUTED, spaceAfter=3,
        ),
        'small': ParagraphStyle(
            'Small', parent=base['Normal'], fontName='ResumeSans', fontSize=7.9,
            leading=10.6, textColor=MUTED, spaceAfter=3,
        ),
    }


def section(title: str, styles: dict[str, ParagraphStyle]) -> list:
    return [Paragraph(title.upper(), styles['section'])]


def experience_block(role: str, organisation: str, period: str, context: str, bullets: list[str], styles: dict[str, ParagraphStyle]) -> KeepTogether:
    items = [
        Paragraph(f'{role} | {organisation}', styles['role']),
        Paragraph(f'{period} | {context}', styles['meta']),
    ]
    items.extend(Paragraph(f'- {bullet}', styles['compact']) for bullet in bullets)
    return KeepTogether(items)


def project_block(title: str, evidence: str, detail: str, boundary: str, styles: dict[str, ParagraphStyle]) -> KeepTogether:
    return KeepTogether([
        Paragraph(title, styles['role']),
        Paragraph(evidence, styles['meta']),
        Paragraph(detail, styles['compact']),
        Paragraph(f'<b>Boundary:</b> {boundary}', styles['small']),
    ])


def build_resume(output_path: Path) -> None:
    register_fonts()
    styles = make_styles()
    document = SimpleDocTemplate(
        str(output_path), pagesize=A4,
        leftMargin=16 * mm, rightMargin=16 * mm,
        topMargin=14 * mm, bottomMargin=20 * mm,
        title='Sajeevan Veeriah - Public Resume',
        author='Sajeevan Veeriah',
        subject='Robotics, Mechatronics, AI/ML & End-To-End Automation Engineer',
    )

    story = [
        Paragraph('Sajeevan Veeriah', styles['name']),
        Paragraph('Robotics, Mechatronics, AI/ML &amp; End-To-End Automation Engineer', styles['identity']),
        Paragraph(
            'Geelong, Victoria, Australia | +61 498 586 654 | '
            '<link href="mailto:sajeevanveeriah@gmail.com">sajeevanveeriah@gmail.com</link><br/>'
            '<link href="https://sajeevanveeriah.github.io">sajeevanveeriah.github.io</link> | '
            '<link href="https://github.com/Sajeevanveeriah">github.com/Sajeevanveeriah</link>',
            styles['contact'],
        ),
    ]

    story += section('Profile', styles)
    story.append(Paragraph(
        'I engineer complete systems from physical requirements to verified operation, connecting mechanisms, electronics, embedded control, autonomy, data and software. I work where disciplines meet: turning a physical need into a system that can be built, integrated, tested, fault-found and handed over.',
        styles['body'],
    ))

    story += section('Engineering capability', styles)
    capabilities = [
        '<b>Robotics and mechatronics:</b> ROS 2 Humble, Nav2, MoveIt 2, Gazebo Fortress, SLAM, EKF sensor fusion, localisation, planning, motion control and physical prototyping.',
        '<b>Automation and controls:</b> Siemens TIA Portal, WinCC, PCS 7, iFIX, PVI+, PLC and HMI/SCADA integration, field devices, drives, FAT, SAT and commissioning.',
        '<b>Embedded and connectivity:</b> ESP32, STM32, FreeRTOS, C/C++, PCB bring-up, CAN, UART, I2C, SPI, BLE, LoRaWAN, MQTT and Linux services.',
        '<b>AI/ML, data and software:</b> Python, scikit-learn, OpenCV, YOLO, time-series analysis, MATLAB, Simulink, TypeScript, React, Rust, SQL, CI/CD and local-first software.',
        '<b>Verification and delivery:</b> requirements, instrumentation, calibrated testing, regression, fault isolation, traceable QA, release boundaries and handover evidence.',
    ]
    story.extend(Paragraph(f'- {item}', styles['compact']) for item in capabilities)

    story += section('Selected engineering evidence', styles)
    story.extend([
        project_block(
            'Autonomous Navigation Rover on ROS 2',
            '2024-2025 | Hardware build with simulation-validated autonomy',
            'Built the differential-drive platform and integrated LiDAR, IMU, SLAM, EKF state estimation, Nav2 planning, control and recovery across independently testable ROS 2 nodes. Gazebo Fortress regression runs and RViz inspection checked maps, transforms, pose and planned paths.',
            'No fleet-deployment or certified functional-safety claim.', styles,
        ),
        project_block(
            'ESP32 Clinical Ataxia Assessment Device',
            '2025 | Honours capstone and assessed embedded prototype',
            'Designed the device, custom PCB and enclosure, implemented deterministic 100 Hz acquisition across four Hall-effect channels, Bluetooth live display and CSV/PDF reporting, then checked accuracy, direction, reversal, drift and temperature behaviour against reference instruments in MATLAB.',
            'Not a certified medical device and not a claim of clinical efficacy.', styles,
        ),
        project_block(
            'SWL Pricing and Inventory Control',
            '2026 | Client-commissioned system, release 1.2.0',
            'Sole engineer across requirements, deterministic pricing and matching rules, React/TypeScript interfaces, Tauri/Rust desktop packaging, SQLite, file contracts, CI and release evidence. More than 500 automated checks cover unit, property, browser, accessibility, desktop and Rust behaviour.',
            'Production installation, signing, automatic updates and rollout remain outside the release boundary.', styles,
        ),
        Paragraph(
            '<b>Additional AI/ML evidence - VeerAI:</b> A locally deployed private system around an open-weight small language model, with governed ingestion, retrieval, memory, tools and evaluation. This is private local evidence, not a public production-deployment claim.',
            styles['compact'],
        ),
    ])

    story += section('Professional experience', styles)
    story.extend([
        experience_block(
            'Automation and Controls Engineer', 'Process automation systems integrator', 'Jan 2026 - Jun 2026',
            'Regulated pharmaceutical, biotechnology and food production',
            [
                'Delivered PLC logic, HMI/SCADA, field-device, drive, MES and production-data integration under GMP controls.',
                'Migrated validated application content from iFIX to PVI+, completed functional checks, and supported FAT, SAT, commissioning, handover and mobile-robot fault tracing.',
            ], styles,
        ),
    ])

    story.append(PageBreak())
    story += section('Professional experience continued', styles)
    story.extend([
        experience_block(
            'Product Development Test Engineer (Contract)', 'Global automotive OEM via engineering consultancy', 'Oct 2025 - Jan 2026',
            'Vehicle software integration and ADAS product development',
            [
                'Validated vehicle-software integration and ADAS behaviour through feature-vehicle, breadboard and regression testing.',
                'Instrumented test vehicles and used Vector CANoe and CANalyzer to capture CAN and CAN FD evidence for fault isolation and software-readiness verification.',
            ], styles,
        ),
        experience_block(
            'Technical Officer & Quality Assurance', 'ABMARC', 'Jul 2024 - Aug 2025',
            'Automotive testing, energy, emissions and compliance engineering',
            [
                'Delivered ADR and EURO emissions work, EV/PHEV range testing and vehicle-systems evaluation using calibrated instrumentation, data acquisition and CAN tools.',
                'Maintained traceable QA, safety, regulatory and test records for certification review and audit.',
            ], styles,
        ),
        experience_block(
            'Consultant Engineer, IoT and Projects Administrator', 'DuxTel', 'Feb 2024 - Aug 2024',
            'Networking, low-power telemetry and remote asset visibility',
            [
                'Built field-to-dashboard solutions with ESP32, sensors, LoRaWAN AU915, MQTT, ChirpStack, InfluxDB and Grafana.',
                'Supported CAN and GPS capture, custom PCB work, MikroTik connectivity and Linux services from field trial through handover.',
            ], styles,
        ),
        experience_block(
            'Production Line Team Lead & Cellar Hand', 'IDL Australia', 'Aug 2022 - Feb 2024',
            'Beverage manufacturing, packaging and traceable production',
            [
                'Led day-to-day output, changeovers and shift handovers while maintaining batch quality, traceability and safe operation.',
                'Performed first-response fault recovery and supported installation and commissioning checks during canning-line upgrades.',
            ], styles,
        ),
        experience_block(
            'Production Line Operator and Commissioning Support', 'Carbon Revolution', 'Sep 2021 - Dec 2021',
            'Carbon-fibre wheel production and Industry 4.0 quality control',
            [
                'Operated production equipment, recorded in-process quality and traceability evidence, and supported equipment trials, setup and first-level recovery.',
            ], styles,
        ),
        experience_block(
            'Undergraduate Quality Engineer', 'Thornton Engineering Australia', 'Mar 2018 - Mar 2020',
            'Structural steel and heavy fabrication',
            [
                'Supported drawing review, inspection and test plans, manufacturing data records, material traceability and AS/NZS compliance across design, workshop and inspection boundaries.',
            ], styles,
        ),
    ])

    story += section('Education and professional standing', styles)
    story.extend([
        Paragraph('<b>Bachelor of Mechatronics Engineering (Honours), Distinction</b> | Deakin University | 2025', styles['compact']),
        Paragraph('<b>Higher National Diploma in Mechatronics, Robotics and Automation Engineering, Distinction</b> | Cardiff Metropolitan University | 2016', styles['compact']),
        Paragraph('<b>Member, Engineers Australia</b> | Current Victorian driver licence', styles['compact']),
    ])

    story += section('Training and languages', styles)
    story.extend([
        Paragraph('<b>Training:</b> Lean Six Sigma Foundation, JIRA and Agile, KAIZEN, Industrial Automation and IIoT, AI/ML and CAD.', styles['compact']),
        Paragraph('<b>Languages:</b> English, Tamil and Sinhala.', styles['compact']),
    ])

    story += section('Working style', styles)
    story.append(Paragraph(
        'Understand the whole system, isolate faults and leave clear evidence for verification, commissioning and handover. Beyond project delivery, I play and help run my cricket club, mentor fellow students, and maintain personal robotics and hardware builds.',
        styles['body'],
    ))

    output_path.parent.mkdir(parents=True, exist_ok=True)
    document.build(story, onFirstPage=draw_page, onLaterPages=draw_page)

    reader = PdfReader(str(output_path))
    if len(reader.pages) != 2:
        raise RuntimeError(f'Expected 2 pages, generated {len(reader.pages)}')
    extracted = '\n'.join(page.extract_text() or '' for page in reader.pages)
    forbidden = ['Ford', 'Ford Motor Company', 'Invenio', 'JAG Process Solutions', '\u2013', '\u2014']
    matches = [item for item in forbidden if item in extracted]
    if matches:
        raise RuntimeError(f'Forbidden public resume content: {matches}')


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--output', type=Path,
        default=Path('public/assets/Resume_Sajeevan_Veeriah.pdf'),
    )
    args = parser.parse_args()
    build_resume(args.output)
    print(args.output)


if __name__ == '__main__':
    main()
