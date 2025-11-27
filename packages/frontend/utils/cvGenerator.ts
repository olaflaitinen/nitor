
import { jsPDF } from 'jspdf';
import { User, Experience, Education, Project } from '../types';

export const generateCV = (
    user: User,
    experience: Experience[],
    education: Education[],
    projects: Project[]
) => {
    const doc = new jsPDF();

    // --- STYLES ---
    const margin = 20;
    let y = margin;
    const lineHeight = 6;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = pageWidth - (margin * 2);

    // Helper: Check if new page is needed
    const checkPageBreak = (requiredSpace: number = 20) => {
        if (y + requiredSpace > pageHeight - margin) {
            doc.addPage();
            y = margin;
            return true;
        }
        return false;
    };

    // Helper: Add Text
    const addText = (text: string, size: number, font: 'times' | 'helvetica' = 'times', style: 'normal' | 'bold' | 'italic' = 'normal', align: 'left' | 'center' = 'left') => {
        doc.setFont(font, style);
        doc.setFontSize(size);
        if (align === 'center') {
            doc.text(text, pageWidth / 2, y, { align: 'center' });
        } else {
            const splitText = doc.splitTextToSize(text, contentWidth);
            doc.text(splitText, margin, y);
            return splitText.length * lineHeight; // Return height used
        }
        return lineHeight;
    };

    // Helper: Add Section Header
    const addSection = (title: string) => {
        checkPageBreak(15);
        y += 5;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(79, 70, 229); // Indigo-600
        doc.text(title.toUpperCase(), margin, y);
        y += 2;
        doc.setLineWidth(0.8);
        doc.setDrawColor(79, 70, 229);
        doc.line(margin, y, margin + contentWidth, y);
        doc.setTextColor(0, 0, 0);
        doc.setDrawColor(0, 0, 0);
        y += 8;
    };

    // --- HEADER WITH BRANDING ---
    doc.setFillColor(79, 70, 229); // Indigo-600
    doc.rect(0, 0, pageWidth, 50, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("NITOR", margin, 15);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("Academic Social Network", margin, 20);

    // User Name in header
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(user.name, margin, 38);

    y = 60;
    doc.setTextColor(0, 0, 0);

    // Contact info bar
    doc.setFillColor(248, 250, 252); // Slate-50
    doc.rect(0, y - 5, pageWidth, 18, 'F');

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105); // Slate-600
    const contactInfo = [
        user.handle,
        user.institution || 'Independent Researcher',
        `Nitor Score: ${user.nitorScore || 0}`,
        user.email ? user.email : `${user.handle.replace('@', '')}@nitor.com`
    ].filter(Boolean).join(' • ');
    doc.text(contactInfo, pageWidth / 2, y + 3, { align: 'center' });

    y += 20;
    doc.setTextColor(0, 0, 0);

    // 2. Bio / Summary
    if (user.bio) {
        addSection("Professional Summary");
        const lines = doc.splitTextToSize(user.bio, contentWidth);
        doc.setFont("times", "normal");
        doc.setFontSize(11);
        doc.setTextColor(30, 41, 59); // Slate-800
        doc.text(lines, margin, y);
        y += lines.length * 6 + 5;
        doc.setTextColor(0, 0, 0);
    }

    // 3. Education
    if (education.length > 0) {
        addSection("Education");
        education.forEach(edu => {
            checkPageBreak(25);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text(edu.institution, margin, y);
            const dateText = `${new Date(edu.startDate).getFullYear()} - ${edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}`;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139); // Slate-500
            doc.text(dateText, pageWidth - margin, y, { align: 'right' });
            doc.setTextColor(0, 0, 0);
            y += 6;

            doc.setFont("times", "italic");
            doc.setFontSize(10);
            doc.text(`${edu.degree}, ${edu.fieldOfStudy}`, margin + 3, y);
            y += 6;

            if (edu.grade) {
                doc.setFont("times", "normal");
                doc.setFontSize(9);
                doc.setTextColor(71, 85, 105);
                doc.text(`Grade/GPA: ${edu.grade}`, margin + 3, y);
                doc.setTextColor(0, 0, 0);
                y += 5;
            }
            y += 4;
        });
    }

    // 4. Experience
    if (experience.length > 0) {
        addSection("Professional Experience");
        experience.forEach(exp => {
            checkPageBreak(30);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text(exp.company, margin, y);

            const dateText = `${new Date(exp.startDate).getFullYear()} - ${exp.isCurrent ? 'Present' : (exp.endDate ? new Date(exp.endDate).getFullYear() : '')}`;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139); // Slate-500
            doc.text(dateText, pageWidth - margin, y, { align: 'right' });
            doc.setTextColor(0, 0, 0);
            y += 6;

            doc.setFont("times", "bold");
            doc.setFontSize(10);
            doc.text(exp.role, margin + 3, y);
            y += 6;

            if (exp.description) {
                doc.setFont("times", "normal");
                doc.setFontSize(9);
                doc.setTextColor(51, 65, 85); // Slate-700
                const descLines = doc.splitTextToSize(exp.description, contentWidth - 6);
                doc.text(descLines, margin + 3, y);
                y += descLines.length * 5;
                doc.setTextColor(0, 0, 0);
            }
            y += 5;
        });
    }

    // 5. Projects
    if (projects.length > 0) {
        addSection("Research Projects & Publications");
        projects.forEach(proj => {
            checkPageBreak(25);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text(proj.title, margin, y);
            y += 6;

            if (proj.technologies && proj.technologies.length > 0) {
                const techText = proj.technologies.join(" • ");
                doc.setFont("helvetica", "normal");
                doc.setFontSize(8);
                doc.setTextColor(79, 70, 229); // Indigo-600
                doc.text(`Technologies: ${techText}`, margin + 3, y);
                doc.setTextColor(0, 0, 0);
                y += 5;
            }

            if (proj.description) {
                doc.setFont("times", "normal");
                doc.setFontSize(9);
                doc.setTextColor(51, 65, 85); // Slate-700
                const descLines = doc.splitTextToSize(proj.description, contentWidth - 6);
                doc.text(descLines, margin + 3, y);
                y += descLines.length * 5;
                doc.setTextColor(0, 0, 0);
            }
            y += 5;
        });
    }

    // Footer on every page
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFillColor(248, 250, 252);
        doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(`Generated by NITOR Academic Network on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
        doc.setTextColor(0, 0, 0);
    }

    doc.save(`CV_${user.name.replace(/\s/g, '_')}_Nitor.pdf`);
};
