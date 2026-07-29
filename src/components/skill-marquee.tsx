import { skills } from "@/content/site";

const skillList = Object.values(skills).flat();

export function SkillMarquee() {
  return (
    <div className="marquee" aria-label="Technology skills">
      <div className="marquee-track">
        {[...skillList, ...skillList].map((skill, index) => (
          <span aria-hidden={index >= skillList.length} key={`${skill}-${index}`}>{skill}</span>
        ))}
      </div>
    </div>
  );
}
