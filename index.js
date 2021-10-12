(async () => {
    const { browser, xpage } = await require("./page");
    const fs = require("fs");
    const readline = require('readline');
    let rl = readline.createInterface(process.stdin, process.stdout);
    run().then((page) => page.close()).catch((err) => console.log(err));

    async function run() {
        const { page, captcha } = await load_form();
        console.log(captcha);
        await form_action(page);
        const info = await get_data(page);
        console.log(info);
        return page;
    }

    async function load_form() {
        const context = Math.floor(Math.random() * Math.floor(9999999999));
        const captcha = `captcha_${context}.jpg`;
        const page = await browser.newPage({ context });
        set_download_recaptcha(page, captcha);
        await page.goto("http://www2.repuve.gob.mx:8080/ciudadania/");
        return { page, captcha }
    }

    async function form_action(page) {
        await page.waitForSelector("#modalReemplacamiento button");
        await page.waitFor(1000)
        await page.click("#modalReemplacamiento button");
        await page.click("#placa", { clickCount: 3 });
        await read_placa(async (placa) => {
            await page.type("#placa", placa);
        });
        const submit_button = await page.evaluateHandle(() => jQuery("button:contains('Buscar')").get(0));
        await read_code(async (code) => {
            await page.type("#captcha", code);
            submit_button.click();
        });
        
        await page.waitForNavigation({ timeout: 90000000 });
        await page.waitForFunction(() => typeof jQuery != "undefined");
    }

    async function get_data(page) {
        return await page.evaluate(() => {
            const infomation = jQuery("#tab-info-vehiculo").find("tbody").children("tr").get().reduce((all, row) => {
                const [col1, col2] = jQuery(row).children("td").map((i, cell) => jQuery(cell).text().trim()).get();
                all[col1] = col2;
                return all;
            }, {})
            const PGJ = jQuery("#tab-avisoRobo").find("style").detach().end().text().trim();
            const ORCA = jQuery("#tab-ocra").find("style").detach().end().text().trim();
            return { infomation, PGJ, ORCA }
        })
    }


    async function set_download_recaptcha(page, captcha_name) {
        let writer = fs.createWriteStream(captcha_name);
        page.on("response", async (res) => {
            if (/ciudadania\/jcaptcha/.test(res.url())) {
                console.log(res.url())
                if (res.status() === 200) {
                    writer.write(await res.buffer());

                }
            }
        })

    }

    async function read_placa(cb) {
        const answer = await new Promise(resolve => {
            rl.question('Please Enter the placa: ', resolve)
          })
        cb(answer);
    }

    async function read_code(cb) {
        const answer = await new Promise(resolve => {
            rl.question('Please Enter the Captcha Code: ', resolve)
          })
        cb(answer);
    }

})()