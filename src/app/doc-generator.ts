// Generate a CV
import * as docx from "docx";
import {Document, HeadingLevel, Paragraph} from "docx";
import {saveAs} from "file-saver";

interface Question {
    readonly type: string;
    readonly Question: string;
    readonly answers: string[];
}

const numQuestions: number[] = [3];
const insertType: string[] = ["Multiple Choice"];
const questions: string[] = ["What is the capital of France?","What is the capital of Germany?","What is the capital of Italy?"];
const answers: string[][] = [["Paris","Berlin","Rome"],["Paris","Berlin","Rome"],["Paris","Berlin","Rome"]];
const allQuestions: Question[] = [];

for (let j = 0; j < numQuestions.length; j++) {
    for (let i = 0; i < numQuestions[j]; i++) {
        allQuestions.push({
            type: insertType[j],
            Question: questions[i],
            answers: answers[i],
        });
    }
}

class DocumentCreator {
    // tslint:disable-next-line: typedef
    public create(allQuestions: Question[]): Document {
        const paragraphs = this.generateSections(allQuestions);
        const section = {
            properties: {},
            children: paragraphs,
        };
        return new Document({
            sections: [section],
        });
    }
    private generateSections(allQuestions: Question[]): Paragraph[] {
        const paragraphs: Paragraph[] = [];
        this.createHeading(allQuestions[0].type);
        for(let j=0; j<numQuestions[0]; j++) {
            paragraphs.push(
                this.createSubHeading(allQuestions[j].Question),
            );
            const bulletPoints = allQuestions[j].answers;
            bulletPoints.forEach((bulletPoint: string) => {
                paragraphs.push(this.createBullet(bulletPoint));
            });
        }

        let index = 0;
        for (let i = 1; i<numQuestions.length; i++){
            index += numQuestions[i-1];
            this.createHeading(allQuestions[index].type);
            for(let j=0; j<numQuestions[i]; j++) {
                paragraphs.push(
                    this.createSubHeading(allQuestions[j].Question),
                );
                const bulletPoints = allQuestions[j].answers;
                bulletPoints.forEach((bulletPoint: string) => {
                    paragraphs.push(this.createBullet(bulletPoint));
                });
            }
        }

        return paragraphs;
    }

    public createHeading(text: string): Paragraph {
        return new Paragraph({
            text: text,
            heading: HeadingLevel.HEADING_1,
            thematicBreak: true,
        });
    }

    public createSubHeading(text: string): Paragraph {
        return new Paragraph({
            text: text,
            heading: HeadingLevel.HEADING_2,
        });
    }
    public createBullet(text: string): Paragraph {
        return new Paragraph({
            text: text,
            bullet: {
                level: 0,
            },
        });
    }
}

export function generateDoc() {
    const documentCreator = new DocumentCreator();

    const doc = documentCreator.create(allQuestions);

    docx.Packer.toBlob(doc).then((blob) => {
        console.log(blob);
        saveAs(blob, "example.docx");
        console.log("Document created successfully");
    });
}