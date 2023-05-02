import { Module } from "@nestjs/common";
import { PdfService } from "./pdf.service";
//import { PdfController } from "./pdf.controller";

@Module({
    providers: [PdfService],
    controllers: [],
    exports: [PdfService]
})
export class PdfModule { }