import asyncio
import os
import subprocess
import time
import shutil
import urllib.request
from playwright.async_api import async_playwright

def is_server_running(port=8008):
    try:
        with urllib.request.urlopen(f"http://127.0.0.1:{port}/api/health", timeout=1) as resp:
            return resp.status == 200
    except Exception:
        return False

async def main():
    port = 8008
    proc = None

    if not is_server_running(port):
        print(f"Starting server on port {port}...")
        env = os.environ.copy()
        env["PORT"] = str(port)
        env["PYTHONPATH"] = "."
        proc = subprocess.Popen(
            ["./.venv/bin/uvicorn", "backend.main:app", "--port", str(port), "--host", "127.0.0.1"],
            env=env,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        time.sleep(2.5)
    else:
        print(f"Server is already running on port {port}.")

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(
                executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
                headless=True,
            )

            os.makedirs("docs/screenshots", exist_ok=True)
            os.makedirs("docs/assets", exist_ok=True)

            # 1. Desktop Overview (1440 x 900)
            context = await browser.new_context(
                viewport={"width": 1440, "height": 900},
                device_scale_factor=2,
            )
            page = await context.new_page()
            await page.goto(f"http://127.0.0.1:{port}", wait_until="networkidle")
            await page.wait_for_timeout(1200)

            desktop_shot = "docs/screenshots/overview_10_out_of_10.png"
            await page.screenshot(path=desktop_shot, full_page=False)
            shutil.copy(desktop_shot, "docs/assets/01_pulsedesk_overview_desktop.png")
            print(f"Desktop Overview saved to {desktop_shot}")

            # 2. Ask PulseDesk View (Chat + Source Inspector)
            ask_nav = page.locator("text='Ask PulseDesk'").first
            if await ask_nav.is_visible():
                await ask_nav.click()
                await page.wait_for_timeout(1000)
                ask_shot = "docs/screenshots/ask_pulsedesk_10_out_of_10.png"
                await page.screenshot(path=ask_shot, full_page=False)
                shutil.copy(ask_shot, "docs/assets/02_pulsedesk_ask_intelligence.png")
                print(f"Ask PulseDesk saved to {ask_shot}")

            # 3. Projects View
            projects_nav = page.locator("text='Projects'").first
            if await projects_nav.is_visible():
                await projects_nav.click()
                await page.wait_for_timeout(800)
                proj_shot = "docs/screenshots/projects_10_out_of_10.png"
                await page.screenshot(path=proj_shot, full_page=False)
                shutil.copy(proj_shot, "docs/assets/03_pulsedesk_projects.png")
                print(f"Projects saved to {proj_shot}")

            # 4. Sources View
            sources_nav = page.locator("text='Sources'").first
            if await sources_nav.is_visible():
                await sources_nav.click()
                await page.wait_for_timeout(800)
                sources_shot = "docs/screenshots/sources_10_out_of_10.png"
                await page.screenshot(path=sources_shot, full_page=False)
                shutil.copy(sources_shot, "docs/assets/04_pulsedesk_sources.png")
                print(f"Sources saved to {sources_shot}")

            # 5. Changes View
            changes_nav = page.locator("text='Changes'").first
            if await changes_nav.is_visible():
                await changes_nav.click()
                await page.wait_for_timeout(800)
                changes_shot = "docs/screenshots/changes_10_out_of_10.png"
                await page.screenshot(path=changes_shot, full_page=False)
                shutil.copy(changes_shot, "docs/assets/05_pulsedesk_changes.png")
                print(f"Changes saved to {changes_shot}")

            # 6. Mobile Overview (390 x 844)
            mobile_context = await browser.new_context(
                viewport={"width": 390, "height": 844},
                device_scale_factor=2,
                is_mobile=True,
                has_touch=True,
            )
            mobile_page = await mobile_context.new_page()
            await mobile_page.goto(f"http://127.0.0.1:{port}", wait_until="networkidle")
            await mobile_page.wait_for_timeout(1200)

            mobile_shot = "docs/screenshots/mobile_10_out_of_10.png"
            await mobile_page.screenshot(path=mobile_shot, full_page=False)
            shutil.copy(mobile_shot, "docs/assets/06_pulsedesk_mobile_overview.png")
            print(f"Mobile Overview saved to {mobile_shot}")

            await browser.close()
    finally:
        if proc:
            proc.terminate()
            proc.wait()

if __name__ == "__main__":
    asyncio.run(main())
