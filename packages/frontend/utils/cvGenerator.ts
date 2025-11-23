
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
    const contentWidth = pageWidth - (margin * 2);

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
        y += 5;
        doc.setFont("times", "bold");
        doc.setFontSize(12);
        doc.text(title.toUpperCase(), margin, y);
        y += 2;
        doc.setLineWidth(0.5);
        doc.line(margin, y, margin + contentWidth, y);
        y += 6;
    };

    // --- CONTENT ---

    // 1. Header
    y += addText(user.name, 20, 'times', 'bold', 'center');
    y += 2;
    y += addText(`${user.institution} | ${user.handle}`, 10, 'helvetica', 'normal', 'center');
    y += 2;
    // Mock contact info since it's not in User type yet
    y += addText(`Email: ${user.handle.replace('@', '')}@nitor.edu | Nitor Score: ${user.nitorScore}`, 10, 'helvetica', 'normal', 'center');
    y += 10;

    // 2. Bio / Summary
    if (user.bio) {
        addSection("Professional Summary");
        const lines = doc.splitTextToSize(user.bio, contentWidth);
        doc.setFont("times", "normal");
        doc.setFontSize(11);
        doc.text(lines, margin, y);
        y += lines.length * 6 + 5;
    }

    // 3. Education
    if (education.length > 0) {
        addSection("Education");
        education.forEach(edu => {
            doc.setFont("times", "bold");
            doc.text(edu.institution, margin, y);
            const dateText = `${new Date(edu.startDate).getFullYear()} - ${edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}`;
            doc.setFont("helvetica", "normal");
            doc.text(dateText, pageWidth - margin, y, { align: 'right' });
            y += 5;
            
            doc.setFont("times", "italic");
            doc.text(`${edu.degree}, ${edu.fieldOfStudy}`, margin, y);
            y += 5;
            
            if (edu.grade) {
                doc.setFont("times", "normal");
                doc.setFontSize(10);
                doc.text(`Grade/GPA: ${edu.grade}`, margin, y);
                y += 5;
            }
            y += 3;
        });
    }

    // 4. Experience
    if (experience.length > 0) {
        addSection("Experience");
        experience.forEach(exp => {
            doc.setFont("times", "bold");
            doc.setFontSize(11);
            doc.text(exp.company, margin, y);
            
            const dateText = `${new Date(exp.startDate).getFullYear()} - ${exp.isCurrent ? 'Present' : (exp.endDate ? new Date(exp.endDate).getFullYear() : '')}`;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(dateText, pageWidth - margin, y, { align: 'right' });
            y += 5;

            doc.setFont("times", "italic");
            doc.setFontSize(11);
            doc.text(exp.role, margin, y);
            y += 5;

            if (exp.description) {
                doc.setFont("times", "normal");
                doc.setFontSize(10);
                const descLines = doc.splitTextToSize(exp.description, contentWidth - 5);
                doc.text(descLines, margin + 2, y);
                y += descLines.length * 5;
            }
            y += 4;
        });
    }

    // 5. Projects
    if (projects.length > 0) {
        addSection("Projects & Technical Skills");
        projects.forEach(proj => {
            doc.setFont("times", "bold");
            doc.setFontSize(11);
            doc.text(proj.title, margin, y);
            
            if (proj.technologies && proj.technologies.length > 0) {
                const techText = proj.technologies.join(", ");
                doc.setFont("helvetica", "italic");
                doc.setFontSize(9);
                const w = doc.getTextWidth(proj.title);
                doc.text(`  (${techText})`, margin + w + 2, y);
            }
            y += 5;

            if (proj.description) {
                doc.setFont("times", "normal");
                doc.setFontSize(10);
                const descLines = doc.splitTextToSize(proj.description, contentWidth);
                doc.text(descLines, margin, y);
                y += descLines.length * 5;
            }
            y += 3;
        });
    }

    // Footer
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Generated by NITOR Academic Network on ${new Date().toLocaleDateString()}`, pageWidth / 2, 285, { align: 'center' });

    doc.save(`CV_${user.name.replace(/\s/g, '_')}.pdf`);
};
