// Generate a CV
import {
    AlignmentType,
    Document,
    HeadingLevel,
    Packer,
    Paragraph,
    Tab,
    TabStopPosition,
    TabStopType,
    TextRun
} from "docx";
import * as docx from "docx";
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
    public create(allQuestions: [Question[]]): Document {
        return new Document({
            sections: [
                {
                    children: [
                        this.createHeading(insertType[0]),
                        ...allQuestions.map((question ) => {
                                const arr: Paragraph[] = [];
                                arr.push(
                                    this.createSubHeading(question[0].Question),
                                );
                                const bulletPoints = question[0].answers;
                                bulletPoints.forEach((bulletPoint) => {
                                    arr.push(this.createBullet(bulletPoint));
                                });

                                return arr;
                            })
                            .reduce((prev, curr) => prev.concat(curr), []),
                    ],
                },
            ],
        });
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

    const doc = documentCreator.create([allQuestions]);

    docx.Packer.toBlob(doc).then((blob) => {
        console.log(blob);
        saveAs(blob, "example.docx");
        console.log("Document created successfully");
    });
}