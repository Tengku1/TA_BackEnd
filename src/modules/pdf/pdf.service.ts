import { Injectable, Logger } from "@nestjs/common";
import path from "path";
import puppeteer from 'puppeteer';
import { Readable } from "stream";
import * as fs from 'fs';
import * as util from 'util';
import handlebars from 'handlebars';

@Injectable()
export class PdfService {
    constructor() {}
    private readonly logger: Logger = new Logger(PdfService.name)

    async loadTemplate(template: string, data) {
        try {
            const readFile = util.promisify(fs.readFile);
            const html = await readFile(path.resolve(__dirname, '../../../views/pdf/', template));
            const compiled = handlebars.compile(html.toString())(data);
            return compiled;
        } catch (error) {
            this.logger.log(JSON.stringify(error));
            throw error;
        }
    }

    /**
     * Render PDF From URL
     * @param url
     * @param options
     */
    // async renderPdfFromUrl(url: string, options?: puppeteer.PDFOptions) {
    //     this.logger.log("Try to open puppeteer browser...")
    //     const browser = await puppeteer.launch();

    //     this.logger.log("Try to open browser new page...")
    //     const page = await browser.newPage()

    //     this.logger.log(`Navigate to ${url}...`)
    //     await page.goto(url)

    //     // if (options) {
    //     //     await page.emulateMedia(options.screen ? 'screen' : 'print')
    //     // }

    //     this.logger.log(`Generate PDF...`)
    //     const pdfContent = await page.pdf({
    //         printBackground: true,
    //         format: 'a4',
    //         margin: {
    //             top: 0,
    //             left: 0,
    //             bottom: 0,
    //             right: 0,
    //         }
    //     } as puppeteer.PDFOptions)

    //     this.logger.log(`Close Browser...`)
    //     await browser.close()

    //     return pdfContent;
    // }
    /**
     * Render PDF From HTML
     * @param html 
     * @param options 
     */
    async renderPdfFromHtml(html: string, options?: puppeteer.PDFOptions) {
        try {

            this.logger.log("Try to open puppeteer browser...")
            const browser = await puppeteer.launch({
                userDataDir: './.temp',
                headless: true,
                //executablePath: '/usr/bin/chromium-browser',
                args: [
                    "--disable-gpu",
                    "--disable-dev-shm-usage",
                    "--disable-setuid-sandbox",
                    "--no-sandbox"
                ]
            });

            this.logger.log("Try to open browser new page...")
            const page = await browser.newPage()

            this.logger.log(`Load HTML...`)
            await page.setContent(html, { waitUntil: 'load', timeout: 10000 });

            this.logger.log(`Generate PDF...`)
            const pdfContent = await page.pdf({
                printBackground: true,
                format: 'a4',
                margin: {
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                }
            } as puppeteer.PDFOptions);

            this.logger.log(`Close Browser...`)
            await browser.close()

            // this.logger.log(`Close Page...`)
            // await page.close();

            return pdfContent;
        } catch (error) {
            this.logger.log(JSON.stringify(error));
            throw error;
        }
    }

    /**
     * Create Readable Stream
     * @param buffer
     */
    createReadableStream(buffer: Buffer) {
        const stream: Readable = new Readable();
        stream.push(buffer);
        stream.push(null);
        return stream;
    }
}