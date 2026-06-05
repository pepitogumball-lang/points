#!/usr/bin/env python3
import os
import subprocess
import sys

def run(cmd, check=True):
    result = subprocess.run(cmd, shell=True, text=True, capture_output=True)
    if result.stdout:
        print(result.stdout.strip())
    if result.stderr:
        print(result.stderr.strip(), file=sys.stderr)
    if check and result.returncode != 0:
        print(f"Command failed: {cmd}", file=sys.stderr)
        sys.exit(result.returncode)
    return result

def main():
    token = os.environ.get("GITHUB_PERSONAL_ACCESS_TOKEN")
    if not token:
        print("Error: GITHUB_PERSONAL_ACCESS_TOKEN not set in environment.", file=sys.stderr)
        sys.exit(1)

    run("git add .")

    default_msg = "chore: update"
    msg = input(f"Commit message [{default_msg}]: ").strip() or default_msg
    run(f'git commit -m "{msg}"')

    run("git remote set-url origin https://" + token + "@github.com/pepitogumball-lang/points.git")
    run("git push origin main")
    print("Pushed to GitHub successfully!")

if __name__ == "__main__":
    main()
