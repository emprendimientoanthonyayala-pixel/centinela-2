import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 412, 'height': 915})
        page = await context.new_page()

        await page.goto("http://localhost:5173")
        await page.wait_for_timeout(1500)
        await page.screenshot(path="/app/verification/screenshots/public_home.png")

        # Open quick action menu and go to Emprendimientos
        await page.click("text=Más")
        await page.wait_for_timeout(500)
        await page.locator(".quick-action-open-button", has_text="Emprendimientos").click()
        await page.wait_for_timeout(1000)
        await page.screenshot(path="/app/verification/screenshots/public_emprendimientos.png")

        # Click MotoPana card
        await page.click("text=MotoPana")
        await page.wait_for_timeout(800)
        await page.screenshot(path="/app/verification/screenshots/filter_motopana.png")

        # Click Inicio
        await page.click("button:has-text('Inicio')")
        await page.wait_for_timeout(800)

        # Open Donaciones
        await page.click("text=Más")
        await page.wait_for_timeout(500)
        await page.locator(".quick-action-open-button", has_text="Donaciones").click()
        await page.wait_for_timeout(1000)
        await page.screenshot(path="/app/verification/screenshots/public_donaciones.png")

        # Click to inspect registration modal
        await page.click("text=Registrarme para ver datos")
        await page.wait_for_timeout(1000)
        await page.screenshot(path="/app/verification/screenshots/registration_modal_optional_fields.png")

        await browser.close()

asyncio.run(main())
