'use client';

import { useState } from 'react';
import Image from 'next/image';
import projectsData from '../data/projects.json';
import { parseRichText, renderRichText } from '../utils/richTextParser';
import { Post } from '../utils/mdxUtils';
import ReactMarkdown from 'react-markdown';

interface Project {
  id: number;
  title: string;
  year: string;
  description: string;
  image: string;
  link?: string;
  collaboration?: string;
}

interface Update {
  id: number;
  title: string;
  date: string;
  type: string;
  content: string;
}

// Type the imported JSON data
const projects: Project[] = projectsData as Project[];

interface HomeClientProps {
  posts: Post[];
}

export default function HomeClient({ posts }: HomeClientProps) {
  const [activeTab, setActiveTab] = useState<'projects' | 'information'>('projects');
  const [openUpdates, setOpenUpdates] = useState<number[]>([]);

  const toggleUpdate = (updateId: number) => {
    setOpenUpdates(prev => 
      prev.includes(updateId) 
        ? prev.filter(id => id !== updateId)
        : [...prev, updateId]
    );
  };

  // Convert posts to updates format for compatibility
  const updates: Update[] = posts.map(post => ({
    id: post.id,
    title: post.title,
    date: post.date,
    type: post.type,
    content: post.content,
  }));

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="identity">
          {/* <div className="profile-img">
            <Image 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" 
              alt="Profile" 
              width={46} 
              height={46}
            />
          </div> */}
          <div className="name-container">
            <h1>Listen.codes</h1>
            <h2>by Listen</h2>
          </div>
          <p>Listen.codes is a project led by Johnnie Yu, tech-ifying the combined knowledge of Listen into a series of tech products, sometimes useful, mostly experimental.</p>
        </div>
      </div>

      {/* Navigation Toggle */}
      <div className="toggle-container">
        <div className="toggle-pill">
          <div className={`pill ${activeTab}`}></div>
          <button 
            className={activeTab === 'projects' ? 'active' : ''}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
          <button 
            className={activeTab === 'information' ? 'active' : ''}
            onClick={() => setActiveTab('information')}
          >
            Updates
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="content">
        <div className={`content-section projects ${activeTab === 'projects' ? 'active' : ''}`}>
          <div className="projects-grid">
            {projects.map((project: Project) => (
              <div key={project.id} className="project">
                <div className="attachments">
                  <div className="attachment">
                    <div className="media">
                      <Image 
                        src={project.image} 
                        alt={project.title}
                        width={800}
                        height={450}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          objectPosition: 'center'
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="projectInfo">
                  <div className="project-header">
                    <h2 className="project-title">
                      {project.link ? (
                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                          {project.title}
                          <span className="link-arrow">↗</span>
                        </a>
                      ) : (
                        project.title
                      )}
                    </h2>
                    <span className="project-year">{project.year}</span>
                  </div>
                  <div className="project-description">
                    <p>{project.description}</p>
                  </div>
                  {project.collaboration && (
                    <div className="project-collaboration">
                      {project.collaboration}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={`content-section information ${activeTab === 'information' ? 'active' : ''}`}>
          <div className="information">
            <h2>Latest Updates</h2>
            <div className="updates">
              {updates.map((update: Update) => (
                <div key={update.id} className="update-item">
                  <div 
                    className="update-header"
                    onClick={() => toggleUpdate(update.id)}
                  >
                    <h3 className="update-title">{update.title}</h3>
                    <span className="update-date">{update.date}</span>
                  </div>
                  <div className={`update-content ${openUpdates.includes(update.id) ? 'open' : ''}`}>
                    <div className="update-description">
                      <ReactMarkdown>{update.content}</ReactMarkdown>
                    </div>
                    <div className="update-meta">
                      <span className={`update-tag ${update.type}`}>
                        {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 