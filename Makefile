.PHONY: run debug fpv-debug

run:
	npm run dev

debug fpv-debug:
	VITE_FPV_DEBUG_SURFACES=true npm run dev
