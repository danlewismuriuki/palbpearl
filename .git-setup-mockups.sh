#!/usr/bin/env bash
set -euo pipefail
cd /c/Users/DanLewisMuriuki/palbpearl

grep -q '^Figma/$' .gitignore || {
  echo '' >> .gitignore
  echo '# Raw Stitch export — curated mockups live in docs/design/mockups/' >> .gitignore
  echo 'Figma/' >> .gitignore
}
echo '=== .gitignore tail ==='
tail -3 .gitignore

git add -A

echo ''
echo '=== staged sensitive check (should print clean) ==='
git diff --cached --name-only | grep -iE '\.env$|node_modules/|\.next/' || echo 'clean'

echo ''
echo '=== staged file count ==='
git diff --cached --name-only | wc -l

echo ''
echo '=== confirm Figma/ NOT staged (should be empty) ==='
git diff --cached --name-only | grep '^Figma/' || echo 'Figma/ correctly excluded'

git commit -m 'chore: initial commit — docs, ADRs, scaffold, and design system'

SRC='Figma/stitch_palbpearl_mushroom_farming_app/stitch_palbpearl_mushroom_farming_app'

echo ''
echo '=== source folder check ==='
ls "$SRC" 2>/dev/null | grep -E '_web$' || {
  echo 'ERROR: expected folders not found. Adjust SRC path and re-run from step 4.'
  exit 1
}

mkdir -p docs/design/mockups

cp "$SRC/farmer_registration_web/screen.png"             docs/design/mockups/register.png
cp "$SRC/home_dashboard_web/screen.png"                  docs/design/mockups/home-dashboard.png
cp "$SRC/darkroom_construction_guide_web/screen.png"     docs/design/mockups/darkroom-guide.png
cp "$SRC/production_guide_plant_doctor_web/screen.png"   docs/design/mockups/production-plant-doctor.png
cp "$SRC/technical_support_ticket_web/screen.png"        docs/design/mockups/technical-support.png

echo ''
echo '=== mockups folder ==='
ls -la docs/design/mockups/

cat > docs/design/mockups/README.md << 'EOF'
# Stitch mockups (visual reference only)

Visual reference screens generated in Google Stitch during the demo design
phase. These are NOT the source of truth.

Source of truth:
- Rules: ../design-conventions.md
- Values: ../tokens.md
- Contract: ../../packages/api-contract/src/index.ts

If a mockup conflicts with design-conventions.md or tokens.md, the rules and
values win.

| Mockup | Screen | Contract types |
|---|---|---|
| register.png | Registration (Module 1) | FarmerRegistrationRequest, Farmer |
| home-dashboard.png | Home | — |
| darkroom-guide.png | Darkroom construction guide | — |
| production-plant-doctor.png | Production + Plant Doctor | — |
| technical-support.png | Technical support ticket | — |
EOF

git add docs/design/mockups
git commit -m 'docs(design): add curated Stitch mockups (web-framed) as visual reference'

echo ''
echo '=== git log ==='
git log --oneline -3

echo ''
echo '=== git status (should be clean) ==='
git status

echo ''
echo '=== tracked PNGs (expect exactly 5 under docs/design/mockups/) ==='
git ls-files | grep -E '\.(png|jpg)$'

echo ''
echo '=== Figma/ still on disk? ==='
[ -d Figma ] && echo 'yes (ignored, not tracked)' || echo 'no'