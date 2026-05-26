// src/data/casestudy.ts
// ⚠️ BACKUP FILE. Live site uses Database.

export interface CaseStudy {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    brandLogo: string;
    image: string;
    heroImage: string;
    date: string;
    isoDate: string;
    readTime: string;
    author: string;
    industry: string;
    platform: string;
    content: string;
}

export const caseStudies: CaseStudy[] = [
    {
        "id": "placeholder-1",
        "title": "Case Study Coming Soon",
        "excerpt": "We are currently updating our case studies. Please check back later.",
        "category": "UPCOMING",
        "brandLogo": "/favicon.ico",
        "image": "/casestudy/case1.png",
        "heroImage": "/casestudy/case1.png",
        "date": "Dec 28, 2025",
        "isoDate": "2025-12-28",
        "readTime": "1 min read",
        "author": "Arexa Team",
        "industry": "Technology",
        "platform": "General",
        "content": "[{\"type\":\"paragraph\",\"value\":\"<p>Detailed case study content will be available soon.</p>\"}]",
        "created_at": "2025-12-28 00:00:00",
        "manual_base": 1000,
        "real_clicks": 0
    }
];