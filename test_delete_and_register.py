import asyncio
from playwright.async_api import async_playwright

async def function_test():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width': 412, 'height': 915})
        page = await context.new_page()

        # 1. Open App
        await page.goto('http://localhost:4173')
        await page.wait_for_timeout(1000)

        # Handle initial registration if presented
        if await page.query_selector('text="Completa tu registro"'):
            await page.fill('input[name="cedula"]', 'V-10000001')
            await page.fill('input[name="nombresApellidos"]', 'Super Usuario Centinela')
            await page.select_option('select[name="genero"]', 'Masculino')
            await page.fill('input[name="fechaNacimiento"]', '1990-01-01')
            await page.select_option('select[name="estado"]', 'Distrito Capital')
            await page.select_option('select[name="municipio"]', 'Libertador')
            await page.select_option('select[name="parroquia"]', 'Caricuao')
            await page.fill('input[name="comuna"]', 'Comuna Central')
            await page.fill('input[name="concejoComunal"]', 'CC 1')
            await page.fill('input[name="telefono"]', '04121111111')
            await page.click('button[type="submit"]')
            await page.wait_for_timeout(1000)

        # Switch to Super Usuario role
        await page.click('text=👤 Integrante Comunitario ▾')
        await page.wait_for_timeout(500)
        await page.click('button:has-text("Super Usuario")')
        await page.wait_for_timeout(500)

        # Go to Admin Panel
        await page.click('text=Menú')
        await page.wait_for_timeout(500)
        await page.click('text=Panel Admin')
        await page.wait_for_timeout(1000)

        # Test "Probar nuevo registro (Cerrar sesión)"
        page.on('dialog', lambda dialog: dialog.accept())
        await page.click('text=+ Probar nuevo registro (Cerrar sesión)')
        await page.wait_for_timeout(1000)

        # Now fill registration form for a new normal user (e.g., Ana Gómez)
        await page.fill('input[name="cedula"]', 'V-28999888')
        await page.fill('input[name="nombresApellidos"]', 'Ana Gómez')
        await page.select_option('select[name="genero"]', 'Femenino')
        await page.fill('input[name="fechaNacimiento"]', '1998-05-12')
        await page.select_option('select[name="estado"]', 'Distrito Capital')
        await page.select_option('select[name="municipio"]', 'Libertador')
        await page.select_option('select[name="parroquia"]', 'Sucre')
        await page.fill('input[name="comuna"]', 'Comuna Sucre Unida')
        await page.fill('input[name="concejoComunal"]', 'CC Sucre 2')
        await page.fill('input[name="telefono"]', '04149998877')

        # Take screenshot of registration form
        await page.screenshot(path='/home/jules/verification/screenshots/new_registration_form.png')

        # Submit registration
        await page.click('button[type="submit"]')
        await page.wait_for_timeout(1000)

        # Take screenshot of app header showing default role "Integrante Comunitario"
        await page.screenshot(path='/home/jules/verification/screenshots/new_user_dashboard.png')

        # Now switch to Super Usuario again to see Ana Gómez in the user list and test deletion
        await page.click('text=👤 Integrante Comunitario ▾')
        await page.wait_for_timeout(500)
        await page.click('button:has-text("Super Usuario")')
        await page.wait_for_timeout(500)

        await page.click('text=Menú')
        await page.wait_for_timeout(500)
        await page.click('text=Panel Admin')
        await page.wait_for_timeout(1000)

        # Screenshot of admin panel listing new user
        await page.screenshot(path='/home/jules/verification/screenshots/admin_panel_with_user.png')

        # Delete Ana Gómez
        await page.click('button:has-text("Eliminar usuario")')
        await page.wait_for_timeout(1000)

        # Screenshot after deletion
        await page.screenshot(path='/home/jules/verification/screenshots/admin_panel_after_delete.png')

        await browser.close()

asyncio.run(function_test())
