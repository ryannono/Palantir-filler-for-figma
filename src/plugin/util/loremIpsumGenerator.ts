import { TFillerOption } from "./fillerOptions";

export class LoremIpsumGenerator {
  private loremIpsumWords: string[] = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
    "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
    "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud",
    "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea",
    "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit",
    "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla",
    "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident",
    "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id",
    "est", "laborum", "palantir", "data", "analytics", "platform", "foundry", "gotham", "apollo",
    "big", "data", "integration", "visualization", "intelligence", "machine",
    "learning", "ai", "artificial", "intelligence", "security", "defense",
    "government", "enterprise", "solutions", "insights", "scalability", "innovation",
    "technology", "predictive", "modeling", "decision", "making", "collaboration",
    "efficiency", "automation", "pipeline", "data-driven", "strategy", "optimization",
    "real-time", "monitoring", "risk", "management", "compliance", "privacy",
    "protection", "data", "governance", "cloud", "infrastructure", "deployment",
    "customization", "user", "experience", "interface", "support", "consulting",
    "training", "implementation", "partnership", "ecosystem", "scalability",
    "performance", "reliability", "innovation", "future", "forward", "thinking",
    "transformative"
];

  

  private getRandomWord(): string {
      const randomIndex = Math.floor(Math.random() * this.loremIpsumWords.length);
      return this.loremIpsumWords[randomIndex];
  }

  private generateWords(numWords: number): string {
      const words: string[] = [];
      for (let i = 0; i < numWords; i++) {
          words.push(this.getRandomWord());
      }
      return words.join(' ');
  }

  private generateSentence(): string {
      const numWords = Math.floor(Math.random() * 10) + 5; // Random sentence length between 5 and 15 words
      let sentence = this.generateWords(numWords);
      sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
      return sentence;
  }

  private generateSentences(numSentences: number): string {
      const sentences: string[] = [];
      for (let i = 0; i < numSentences; i++) {
          sentences.push(this.generateSentence());
      }
      return sentences.join(' ');
  }

  private generateParagraph(numSentences: number): string {
      return this.generateSentences(numSentences);
  }

  private generateParagraphs(numParagraphs: number, sentencesPerParagraph: number): string {
      const paragraphs: string[] = [];
      for (let i = 0; i < numParagraphs; i++) {
          paragraphs.push(this.generateParagraph(sentencesPerParagraph));
      }
      return paragraphs.join('\n\n');
  }

  public generate(count: number, type: TFillerOption): string {
      switch (type) {
          case 'WORD':
              return this.generateWords(count);
          case 'SENTENCE':
              return this.generateSentences(count);
          case 'PARAGRAPH':
              return this.generateParagraphs(count, 5); // Assuming 5 sentences per paragraph
          default:
              throw new Error("Invalid type. Use 'words', 'sentences', or 'paragraphs'.");
      }
  }
}
