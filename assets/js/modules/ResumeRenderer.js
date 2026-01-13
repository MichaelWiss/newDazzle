/**
 * ResumeRenderer
 * Dynamically renders the resume structure into a container
 */
import { DOMUtils } from './domUtils.js';

export class ResumeRenderer {
    /**
     * Render the resume into a container
     * @param {HTMLElement} container - The container element (e.g., drawer content wrapper)
     * @param {Object} data - The resume data object
     */
    static render(container, data) {
        if (!data) return;

        // Page Wrapper
        const page = DOMUtils.createElement('div', 'page');
        
        // 1. Header
        this.renderHeader(page, data.header);

        // Main Content Wrapper
        const main = DOMUtils.createElement('main');

        // 2. Experience Section
        this.renderExperience(main, data.experience);

        // 3. Two Column Section (Skills & Education)
        this.renderTwoColumn(main, data);
        
        DOMUtils.append(page, main);
        DOMUtils.append(container, page);
    }

    static renderHeader(parent, headerData) {
        if (!headerData) return;

        const header = DOMUtils.createElement('header');
        
        // Create header-top container for name and portfolio link
        const headerTop = DOMUtils.createElement('div', 'header-top');
        
        const h1 = DOMUtils.createElement('h1', 'resume-name', { text: headerData.name });
        DOMUtils.append(headerTop, h1);
        
        // Add portfolio link if provided
        if (headerData.portfolioUrl) {
            const portfolioLink = DOMUtils.createElement('a', 'portfolio-link', {
                href: headerData.portfolioUrl,
                text: 'michaelwiss.vercel.app',
                target: '_blank',
                rel: 'noreferrer noopener'
            });
            DOMUtils.append(headerTop, portfolioLink);
        }
        
        DOMUtils.append(header, headerTop);

        if (headerData.links) {
            const contact = DOMUtils.createElement('div', 'contact');
            
            // Add Title and Location as spans first if needed? 
            // The resume.html shows:
            // <span>Web Developer</span>
            // <span>Minneapolis, NY, Remote</span>
            if (headerData.title) {
                const span = DOMUtils.createElement('span', '', { text: headerData.title });
                DOMUtils.append(contact, span);
            }
            if (headerData.location) {
                const span = DOMUtils.createElement('span', '', { text: headerData.location });
                DOMUtils.append(contact, span);
            }

            headerData.links.forEach(link => {
                const span = DOMUtils.createElement('span');
                
                if (link.isButton) {
                    const btn = DOMUtils.createElement('button', 'download-btn', { text: link.text });
                    btn.onclick = () => window.print();
                    DOMUtils.append(span, btn);
                } else if (link.url) {
                    const a = DOMUtils.createElement('a', '', { 
                        href: link.url, 
                        text: link.text,
                        target: link.url.startsWith('http') ? '_blank' : '',
                        rel: link.url.startsWith('http') ? 'noreferrer noopener' : ''
                    });
                    DOMUtils.append(span, a);
                } else {
                    span.textContent = link.text;
                }
                
                DOMUtils.append(contact, span);
            });
            DOMUtils.append(header, contact);
        }
        
        DOMUtils.append(parent, header);
    }

    static renderExperience(parent, experienceData) {
        if (!experienceData) return;

        const section = DOMUtils.createElement('section', 'section');
        const h2 = DOMUtils.createElement('h2', '', { text: 'Experience' });
        DOMUtils.append(section, h2);

        experienceData.forEach(job => {
            const jobDiv = DOMUtils.createElement('div', 'job');

            // Job Header
            const header = DOMUtils.createElement('div', 'job-header');
            const left = DOMUtils.createElement('div');
            
            const title = DOMUtils.createElement('span', 'job-title', { text: job.title });
            const company = DOMUtils.createElement('span', 'company', { text: ` — ${job.company}` });
            
            DOMUtils.append(left, title);
            DOMUtils.append(left, company);
            
            const date = DOMUtils.createElement('span', 'date', { text: job.date });
            
            DOMUtils.append(header, left);
            DOMUtils.append(header, date);
            DOMUtils.append(jobDiv, header);

            // Description
            if (job.description) {
                const p = DOMUtils.createElement('p', 'description', { text: job.description });
                DOMUtils.append(jobDiv, p);
            }

            // Projects
            if (job.projects) {
                job.projects.forEach(proj => {
                    const projDiv = DOMUtils.createElement('div', 'project');
                    
                    const nameDiv = DOMUtils.createElement('div', 'project-name');
                    const link = DOMUtils.createElement('a', '', {
                        href: proj.url,
                        text: proj.name,
                        target: '_blank'
                    });
                    if (proj.noHover) {
                        DOMUtils.addClass(link, 'no-hover');
                    }
                    DOMUtils.append(nameDiv, link);
                    
                    const descDiv = DOMUtils.createElement('div', 'project-desc', { text: proj.desc });
                    
                    DOMUtils.append(projDiv, nameDiv);
                    DOMUtils.append(projDiv, descDiv);
                    DOMUtils.append(jobDiv, projDiv);
                });
            }

            // Skills (Tags)
            if (job.skills) {
                const skillsDiv = DOMUtils.createElement('div', 'skills');
                job.skills.forEach(skill => {
                    const span = DOMUtils.createElement('span', 'skill-tag', { text: skill });
                    DOMUtils.append(skillsDiv, span);
                });
                DOMUtils.append(jobDiv, skillsDiv);
            }

            DOMUtils.append(section, jobDiv);
        });

        DOMUtils.append(parent, section);
    }

    static renderTwoColumn(parent, data) {
        const wrapper = DOMUtils.createElement('div', 'two-column');
        
        // Technical Skills Column
        if (data.technicalSkills) {
            const section = DOMUtils.createElement('section');
            const h2 = DOMUtils.createElement('h2', '', { text: 'Technical Skills' });
            DOMUtils.append(section, h2);

            const div = DOMUtils.createElement('div');
            div.style.fontSize = '10.5px';
            div.style.lineHeight = '1.5';
            
            const createSkillLine = (label, text) => {
                const strong = document.createElement('strong');
                strong.textContent = label + ': ';
                div.appendChild(strong);
                div.appendChild(document.createTextNode(text));
                div.appendChild(document.createElement('br'));
            };

            if (data.technicalSkills.frontend) createSkillLine('Frontend', data.technicalSkills.frontend);
            if (data.technicalSkills.backend) createSkillLine('Backend & Tools', data.technicalSkills.backend);
            if (data.technicalSkills.specializations) createSkillLine('Specializations', data.technicalSkills.specializations);

            DOMUtils.append(section, div);
            DOMUtils.append(wrapper, section);
        }

        // Education Column
        if (data.education) {
            const section = DOMUtils.createElement('section');
            const h2 = DOMUtils.createElement('h2', '', { text: 'Education' });
            DOMUtils.append(section, h2);

            const eduDiv = DOMUtils.createElement('div', 'education');
            const left = DOMUtils.createElement('div');
            
            const degree = DOMUtils.createElement('div', 'degree', { text: data.education.degree });
            const school = DOMUtils.createElement('div');
            school.style.fontSize = '10.5px';
            school.style.color = '#666';
            school.textContent = data.education.school;
            
            DOMUtils.append(left, degree);
            DOMUtils.append(left, school);
            
            const date = DOMUtils.createElement('div', 'date', { text: data.education.year });
            
            DOMUtils.append(eduDiv, left);
            DOMUtils.append(eduDiv, date);
            
            DOMUtils.append(section, eduDiv);
            DOMUtils.append(wrapper, section);
        }

        DOMUtils.append(parent, wrapper);
    }
}
