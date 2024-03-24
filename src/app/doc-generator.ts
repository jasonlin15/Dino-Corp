// Generate a CV
import * as docx from "docx";
import {Document, HeadingLevel, Paragraph} from "docx";
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
            sections: [section],
        });
    }
    private generateSections(allQuestions: Question[]): Paragraph[] {
        const paragraphs: Paragraph[] = [];
        for (let i = 0; i<allQuestions.length; i++){
            if (i != 0){
                if (allQuestions[i].type != allQuestions[i-1].type){
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

export function generateDoc(allQuestions: Question[]) {
    const documentCreator = new DocumentCreator();

    const doc = documentCreator.create(allQuestions);

    docx.Packer.toBlob(doc).then((blob) => {
        console.log(blob);
        saveAs(blob, "example.docx");
        console.log("Document created successfully");
    });
}