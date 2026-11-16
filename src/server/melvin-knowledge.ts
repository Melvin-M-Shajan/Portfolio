import { petAssistant } from "../content/assistant.js";
import { posts } from "../content/posts.js";
import { projects } from "../content/projects.js";
import { openSourceProjects, siteConfig, skills, workHighlights } from "../content/site.js";

const formatProject = (project: (typeof projects)[number]) => {
  const outcomes = project.outcomes
    .filter((outcome) => outcome.value !== null)
    .map((outcome) => `${outcome.label}: ${outcome.value}`)
    .join("; ");
  const links = Object.entries(project.links)
    .filter((entry): entry is [string, string] => entry[1] !== null)
    .map(([label, href]) => `${label}: ${href}`)
    .join("; ");

  return [
    `${project.title}: ${project.strapline}`,
    `Problem: ${project.problem}`,
    `Approach: ${project.approach.join(" ")}`,
    `Challenges: ${project.challenges.join(" ")}`,
    `Technologies: ${project.technologies.join(", ")}`,
    outcomes ? `Verified outcomes: ${outcomes}` : "Verified numeric outcomes: unavailable.",
    links ? `Available links: ${links}` : "Public links: unavailable.",
  ].join("\n");
};

export const melvinKnowledge = [
  `Name: ${siteConfig.name}`,
  `Role: ${siteConfig.role}`,
  `Location: ${petAssistant.profile.location}`,
  `Professional summary: ${siteConfig.summary}`,
  `Education: ${petAssistant.profile.education}`,
  `Experience: ${petAssistant.profile.experience}`,
  `Languages: ${petAssistant.profile.languages.join(", ")}`,
  `Email: ${siteConfig.email}`,
  `Social profiles: ${siteConfig.social.map((item) => `${item.label}: ${item.href}`).join("; ")}`,
  `Published package: ${siteConfig.publishedPackage.name} — ${siteConfig.publishedPackage.description} Install with: ${siteConfig.publishedPackage.installCommand}. URL: ${siteConfig.publishedPackage.href}`,
  `Skills:\n${Object.entries(skills).map(([group, values]) => `${group}: ${values.join(", ")}`).join("\n")}`,
  `Selected work highlights:\n${workHighlights.map((item) => `${item.title}: ${item.detail}`).join("\n")}`,
  `Detailed case studies:\n${projects.map(formatProject).join("\n\n")}`,
  `Open-source projects:\n${openSourceProjects.map((repo) => `${repo.title} (${repo.kind}): ${repo.detail} Technologies: ${repo.technologies.join(", ")}. Repository: ${repo.href}`).join("\n")}`,
  `Current research interests:\n${siteConfig.currentExploring.map((item) => `${item.title}: ${item.detail}`).join("\n")}`,
  `Writing:\n${posts.map((post) => `${post.title} (${post.date}; ${post.draft ? "draft" : "published"}): ${post.description}`).join("\n")}`,
].join("\n\n");
