// Generate a CV
import * as docx from "docx";
import {Document, HeadingLevel, LevelFormat, Paragraph, TextRun} from "docx";
import {saveAs} from "file-saver";
import {Question} from "@/app/types";

class DocumentCreator {
    // tslint:disable-next-line: typedef
    public create(allQuestions: Question[]): Document {
        const paragraphs = this.generateSections(allQuestions);
        const section = {
            properties: {},
            children: paragraphs,
        };
        return new Document({
            numbering: {
                config: [
                    {
                        reference: "Choice",
                        levels: [
                            {
                                level: 0,
                                format: LevelFormat.UPPER_LETTER,
                                text: "%1",
                            },
                        ],
                    },
                ]
            },
            sections: [section],
        });
    }
    private generateSections(allQuestions: Question[]): Paragraph[] {
        const paragraphs: Paragraph[] = [];
        let questionCount = 0; // Add a new variable to keep track of the number of questions

        for (let i = 0; i<allQuestions.length; i++){
            if (i != 0){
                if (allQuestions[i].type != allQuestions[i-1].type){
                    paragraphs.push(this.createHeading("\n"));
                    paragraphs.push(this.createHeading(allQuestions[i].type));
                }
            } else {
                paragraphs.push(this.createHeading(allQuestions[i].type));
            }
            paragraphs.push(
                this.createSubHeading(allQuestions[i].question),
            );
            const bulletPoints = allQuestions[i].answers;
            if (bulletPoints) {
                bulletPoints.forEach((bulletPoint: string) => {
                    paragraphs.push(this.createBullet(bulletPoint, questionCount)); // Pass the questionCount as the instance number
                });
            }
            if (allQuestions[i].type == 'Short Answer') {
                paragraphs.push(this.createHeading("\n"));
                paragraphs.push(this.createHeading("\n"));

            } else if (allQuestions[i].type == 'Long Answer') {
                paragraphs.push(this.createHeading("\n"));
                paragraphs.push(this.createHeading("\n"));
                paragraphs.push(this.createHeading("\n"));
                paragraphs.push(this.createHeading("\n"));
                paragraphs.push(this.createHeading("\n"));
                paragraphs.push(this.createHeading("\n"));


            } else {
                paragraphs.push(this.createHeading("\n"));
            }
            questionCount++; // Increment the questionCount each time a new question is added
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
        const subHeadingText = new TextRun({
            text: text,
            color: "000000",
        });

        return new Paragraph({
            children: [subHeadingText],
            heading: HeadingLevel.HEADING_2,
        });
    }
        public createBullet(text: string, num: number): Paragraph {
            return new Paragraph({
                text: text,
                numbering: {
                    reference: "Choice",
                    instance: num,
                    level: 0,
                },
            });
        }
    }

export function generateDoc(allQuestions: Question[]) {
    const documentCreator = new DocumentCreator();

    const doc = documentCreator.create(allQuestions);

    docx.Packer.toBlob(doc).then((blob) => {
        console.log(blob);
        const filename = `DinoCorpAssignment.docx`;
        saveAs(blob, filename);
        console.log("Document created successfully");
    }).catch((error) => {
        console.error("Error creating document:", error);
    });
}