import asyncio
import os
import subprocess
import time
import signal
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

            # 1. Desktop Overview (1440 x 900)
            context = await browser.new_context(
                viewport={"width": 1440, "height": 900},
                device_scale_factor=2,
            )
            page = await context.new_page()
            await page.goto(f"http://127.0.0.1:{port}", wait_until="networkidle")
            await page.wait_for_timeout(1000)

            desktop_shot = "docs/screenshots/overview_10_out_of_10.png"
            await page.screenshot(path=desktop_shot, full_page=False)
            print(f"Desktop Overview saved to {desktop_shot}")

            # 2. Ask PulseDesk View (Chat + Source Inspector)
            ask_nav = page.locator("button[title='Ask PulseDesk']").first
            if await ask_nav.is_visible():
                await ask_nav.click()
                await page.wait_for_timeout(800)
                ask_shot = "docs/screenshots/ask_pulsedesk_10_out_of_10.png"
                await page.screenshot(path=ask_shot, full_page=False)
                print(f"Ask PulseDesk saved to {ask_shot}")

            # 3. Connections Center View (Real Data vs Synthetic Fixtures)
            conn_nav = page.locator("button[title='Connections']").first
            if await conn_nav.is_visible():
                await conn_nav.click()
                await page.wait_for_timeout(600)
                conn_shot = "docs/screenshots/connections_10_out_of_10.png"
                await page.screenshot(path=conn_shot, full_page=False)
                print(f"Connections Center saved to {conn_shot}")

            # 4. Change Radar View
            radar_nav = page.locator("button[title='Change Radar']").first
            if await radar_nav.is_visible():
                await radar_nav.click()
                await page.wait_for_timeout(600)
                radar_shot = "docs/screenshots/change_radar_10_out_of_10.png"
                await page.screenshot(path=radar_shot, full_page=False)
                print(f"Change Radar saved to {radar_shot}")

            # 5. Mobile Overview (390 x 844)
            mobile_context = await browser.new_context(
                viewport={"width": 390, "height": 844},
                device_scale_factor=2,
                is_mobile=True,
                has_touch=True,
            )
            mobile_page = await mobile_context.new_page()
            await mobile_page.goto(f"http://127.0.0.1:{port}", wait_until="networkidle")
            await mobile_page.wait_for_timeout(1000)

            mobile_shot = "docs/screenshots/mobile_10_out_of_10.png"
            await mobile_page.screenshot(path=mobile_shot, full_page=False)
            print(f"Mobile Overview saved to {mobile_shot}")

            await browser.close()
    finally:
        if proc:
            print("Stopping spawned server...")
            proc.send_signal(signal.SIGTERM)
            proc.wait()

if __name__ == "__main__":
    asyncio.run(main())
