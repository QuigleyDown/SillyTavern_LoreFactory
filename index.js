/**
 * LoreFactory Extension for SillyTavern
 * Integrated directly into the World Info (Lorebook) editor toolbar.
 * Version: 1.2.2
 */

(function() {
    const VERSION = "1.2.2";
    console.log(`LoreFactory v${VERSION}: Script executing...`);

    const extensionId = "SillyTavern_LoreFactory";

    // 1. INJECT STYLES
    const styleId = "lore-factory-styles";
    const injectStyles = () => {
        $(`#${styleId}`).remove();
        $('head').append(`
            <style id="${styleId}">
                .lore-factory-container { display: flex; flex-direction: column; gap: 12px; width: 100%; min-width: 750px; padding: 5px; box-sizing: border-box; }
                
                /* Header & Mode Selector */
                .lore-factory-header { display: flex !important; justify-content: space-between !important; align-items: center !important; padding: 10px 15px !important; background: var(--black75a) !important; border-bottom: 2px solid var(--grey40) !important; border-radius: 6px 6px 0 0 !important; }
                
                .lf-mode-group { 
                    display: flex !important; 
                    background: #111 !important; 
                    border: 1px solid var(--grey60) !important; 
                    border-radius: 6px !important; 
                    overflow: hidden !important; 
                    padding: 3px !important;
                    width: 250px !important;
                }
                
                .lf-mode-btn { 
                    padding: 8px 10px !important; 
                    cursor: pointer !important; 
                    font-size: 1em !important; 
                    font-weight: bold !important; 
                    color: #fff !important; 
                    transition: 0.2s !important; 
                    margin: 0 !important; 
                    text-align: center !important; 
                    flex: 1 !important;
                    border: none !important; 
                    border-radius: 4px !important;
                    opacity: 0.4 !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
                
                input[name="lf-mode"]:checked + .lf-mode-btn { 
                    background: #4dff4d !important; 
                    color: #000 !important; 
                    opacity: 1 !important;
                    box-shadow: 0 0 15px rgba(77, 255, 77, 0.3) !important;
                }
                
                .lf-mode-btn:hover:not(input:checked + .lf-mode-btn) { 
                    opacity: 0.8 !important;
                    background: rgba(255,255,255,0.1) !important;
                }

                .lf-action-group { display: flex !important; gap: 10px !important; }
                .lf-action-group .menu_button { padding: 6px 15px !important; height: auto !important; line-height: 1.5 !important; font-size: 0.9em !important; display: flex !important; align-items: center !important; gap: 8px !important; }

                /* Settings Panel */
                .lf-settings-panel { background: rgba(0,0,0,0.2); border: 1px solid var(--grey40); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 10px; }
                .lf-settings-title { font-size: 0.9em; font-weight: bold; color: var(--mainColor); text-align: center; border-bottom: 1px solid var(--grey20); padding-bottom: 5px; margin-bottom: 5px; }
                .lf-settings-grid { display: flex; flex-direction: column; gap: 12px; }
                .lf-settings-row { display: flex; flex-wrap: wrap; gap: 20px; align-items: center; justify-content: center; }
                
                .lf-checkbox-label { display: flex; align-items: center; gap: 8px; cursor: pointer; white-space: nowrap; font-size: 0.9em; }
                .lf-checkbox-label input[type="checkbox"] { width: 16px; height: 16px; margin: 0; }
                
                .lf-input-field { display: flex; align-items: center; gap: 8px; font-size: 0.9em; }
                .lf-input-field input { width: 60px !important; background: var(--black75a) !important; color: var(--mainColor) !important; border: 1px solid var(--grey60) !important; border-radius: 4px; padding: 2px 5px !important; height: 26px !important; text-align: center; }

                /* Textarea */
                #lore-factory-input { width: 100% !important; min-height: 450px !important; background-color: var(--black75a) !important; color: var(--mainColor) !important; border: 1px solid var(--grey60) !important; border-radius: 6px; padding: 12px !important; font-family: 'Consolas', 'Monaco', monospace !important; font-size: 13px !important; line-height: 1.4 !important; resize: vertical !important; box-sizing: border-box !important; }
                
                /* Preview */
                .lf-preview-area { background: var(--black50a); border: 1px solid var(--grey40); border-radius: 6px; padding: 10px; max-height: 120px; display: none; }
                .lf-preview-header { font-size: 0.85em; font-weight: bold; border-bottom: 1px solid var(--grey20); padding-bottom: 4px; margin-bottom: 5px; }
                .lf-preview-list { display: flex; flex-wrap: wrap; gap: 5px; overflow-y: auto; max-height: 80px; }
                .lf-preview-list div { font-size: 0.8em; background: var(--grey20); padding: 2px 8px; border-radius: 4px; border: 1px solid var(--grey40); }

                /* Status & Footer */
                .lf-status-msg { padding: 10px; border-radius: 6px; display: none; font-weight: bold; font-size: 0.95em; text-align: center; border: 1px solid transparent; }
                .lore-factory-error { color: #ff4d4d; background: rgba(255, 77, 77, 0.15); border-color: #ff4d4d; }
                .lore-factory-success { color: #4dff4d; background: rgba(77, 255, 77, 0.15); border-color: #4dff4d; }
                
                .lf-footer { margin-top: 15px !important; display: flex !important; justify-content: center !important; width: 100% !important; }
                .lf-primary-btn { width: 100% !important; max-width: 500px !important; text-align: center !important; background-color: rgba(77, 255, 77, 0.2) !important; border: 1px solid #4dff4d !important; padding: 14px 25px !important; display: flex !important; align-items: center !important; justify-content: center !important; gap: 12px !important; border-radius: 6px !important; font-size: 1.2em !important; cursor: pointer !important; transition: 0.2s !important; box-sizing: border-box !important; color: #4dff4d !important; }
                .lf-primary-btn:hover { background-color: rgba(77, 255, 77, 0.35) !important; box-shadow: 0 0 15px rgba(77, 255, 77, 0.3) !important; transform: translateY(-1px) !important; }
                .lf-primary-btn i { font-size: 1.2em; }

                /* Extension Button in WI Toolbar */
                #lore_factory_import_btn { 
                    background: rgba(77, 255, 77, 0.25) !important;
                    color: #4dff4d !important; 
                    margin: 0 5px !important;
                    display: inline-flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    width: 34px !important;
                    height: 34px !important;
                    min-width: 34px !important;
                    min-height: 34px !important;
                    font-size: 1.2em !important;
                    border-radius: 6px !important;
                    border: 1px solid rgba(77, 255, 77, 0.5) !important;
                    cursor: pointer !important;
                    visibility: visible !important;
                }
                #lore_factory_import_btn:hover {
                    background: rgba(77, 255, 77, 0.4) !important;
                    box-shadow: 0 0 10px rgba(77, 255, 77, 0.3) !important;
                }
            </style>
        `);
    };
    injectStyles();

    // 2. CORE LOGIC
    const LoreFactory = {
        currentPopup: null,
        
        open: async function() {
            console.log(`LoreFactory v${VERSION}: open() called.`);
            try {
                const context = SillyTavern.getContext();
                const { Popup, POPUP_TYPE, renderExtensionTemplateAsync } = context;
                const html = await renderExtensionTemplateAsync(`third-party/${extensionId}`, "popup");
                
                this.currentPopup = new Popup(html, POPUP_TYPE.TEXT, "", {
                    cancelButton: "Close",
                    wide: true,
                    closeOnConfirm: false,
                });

                await this.currentPopup.show();
                injectStyles();
            } catch (err) {
                console.error(`LoreFactory v${VERSION}: Open error:`, err);
            }
        },

        insertTemplate: function() {
            const mode = $('input[name="lf-mode"]:checked').val();
            const $input = $("#lore-factory-input");
            
            if (mode === "json") {
                const template = [
    {
        "comment": "Character Name",
        "key": ["keyword1", "keyword2"],
        "content": "Character description goes here."
    }
];
                $input.val(JSON.stringify(template, null, 4));
            } else {
                const template = "Title,Keywords,Content\nHero,\"hero, protagonist\",A brave warrior.\nVillain,\"dark, evil\",A mysterious shadow.";
                $input.val(template);
            }
            this.updatePreview();
        },

        format: function() {
            const val = $("#lore-factory-input").val();
            if (!val) return;
            try {
                const parsed = JSON.parse(val);
                $("#lore-factory-input").val(JSON.stringify(parsed, null, 4));
                toastr.success("LoreFactory: JSON Formatted.");
            } catch (e) {
                toastr.error("LoreFactory: Invalid JSON - cannot format.");
            }
        },

        clear: function() {
            $("#lore-factory-input").val("");
            $("#lore-factory-status").hide();
            $("#lore-factory-preview").hide();
            this.updatePreview();
        },

        parseCSV: function(text) {
            const lines = text.split(/\r?\n/).filter(line => line.trim());
            if (lines.length < 2) return [];
            
            const parseLine = (line) => {
                const results = [];
                let current = "";
                let inQuotes = false;
                for (let i = 0; i < line.length; i++) {
                    const char = line[i];
                    if (char === '"') inQuotes = !inQuotes;
                    else if (char === ',' && !inQuotes) {
                        results.push(current.trim());
                        current = "";
                    } else current += char;
                }
                results.push(current.trim());
                return results;
            };

            const header = parseLine(lines[0]).map(h => h.toLowerCase());
            const entries = [];

            for (let i = 1; i < lines.length; i++) {
                const cols = parseLine(lines[i]);
                const entry = {};
                header.forEach((colName, idx) => {
                    if (cols[idx] !== undefined) entry[colName] = cols[idx];
                });
                if (entry.comment || entry.title || entry.name) {
                    entries.push(entry);
                }
            }
            return entries;
        },

        updatePreview: function() {
            const input = $("#lore-factory-input").val();
            const mode = $('input[name="lf-mode"]:checked').val();
            const $preview = $("#lore-factory-preview");
            const $list = $("#lf-preview-list");
            const $count = $("#lf-preview-count");
            
            if (!input || !input.trim()) { $preview.hide(); return; }

            try {
                let entries = [];
                if (mode === "json") {
                    const data = JSON.parse(input);
                    entries = Array.isArray(data) ? data : [data];
                } else {
                    entries = this.parseCSV(input);
                }

                $list.empty();
                $count.text(entries.length);
                
                if (entries.length > 0) {
                    entries.slice(0, 30).forEach(e => {
                        const title = e.comment || e.title || e.name || "Untitled";
                        $list.append(`<div>• ${title}</div>`);
                    });
                    if (entries.length > 30) $list.append(`<div>...and ${entries.length - 30} more</div>`);
                    $preview.show();
                } else { $preview.hide(); }
            } catch (e) { $preview.hide(); }
        },

        process: async function() {
            console.log(`LoreFactory v${VERSION}: process() started.`);
            const input = $("#lore-factory-input").val();
            const $status = $("#lore-factory-status");
            
            if (!input || !input.trim()) {
                $status.text("Error: Input is empty.").removeClass("lore-factory-success").addClass("lore-factory-error").show();
                return false;
            }

            const context = SillyTavern.getContext();
            const selectedWorld = $("#world_editor_select option:selected").text();
            
            if (!selectedWorld || selectedWorld.includes("---")) {
                $status.text("Error: No Lorebook selected in editor.").removeClass("lore-factory-success").addClass("lore-factory-error").show();
                return false;
            }

            const worldInfoData = await context.loadWorldInfo(selectedWorld);
            if (!worldInfoData) {
                $status.text("Error: Could not load Lorebook data.").removeClass("lore-factory-success").addClass("lore-factory-error").show();
                return false;
            }

            try {
                const mode = $('input[name="lf-mode"]:checked').val();
                let rawEntries = [];
                if (mode === "json") {
                    const data = JSON.parse(input);
                    rawEntries = Array.isArray(data) ? data : [data];
                } else {
                    rawEntries = this.parseCSV(input);
                }

                if (rawEntries.length === 0) throw new Error("No valid entries found in input.");

                const doOverride = $("#lf-override-enable").is(":checked");
                const forceConstant = $("#lf-set-constant").is(":checked");
                const forceSelective = $("#lf-set-selective").is(":checked");
                const forceDepth = parseInt($("#lf-set-depth").val()) || 4;
                const forceProb = parseInt($("#lf-set-prob").val()) || 100;
                const autoKey = $("#lf-auto-key").is(":checked");
                const smartMerge = $("#lf-merge-mode").is(":checked");

                if (!worldInfoData.entries) worldInfoData.entries = {};

                let addedCount = 0;
                let updatedCount = 0;

                rawEntries.forEach(entry => {
                    const title = entry.comment ?? entry.title ?? entry.name ?? "New Lore Entry";
                    let existingUid = null;

                    if (smartMerge) {
                        existingUid = Object.keys(worldInfoData.entries).find(uid => 
                            worldInfoData.entries[uid].comment === title || 
                            (worldInfoData.entries[uid].automationId === entry.automationId && entry.automationId)
                        );
                    }

                    const uid = existingUid || entry.uid || (Date.now() + Math.floor(Math.random() * 100000));
                    
                    let keys = Array.isArray(entry.key || entry.keywords || entry.keys) 
                        ? (entry.key || entry.keywords || entry.keys) 
                        : String(entry.key || entry.keywords || entry.keys || "").split(',').map(k => k.trim());
                    
                    keys = keys.filter(k => k.trim());
                    
                    if (autoKey && keys.length === 0) {
                        keys = [title];
                    }

                    const newEntry = {
                        uid: uid,
                        key: keys,
                        keysecondary: Array.isArray(entry.keysecondary || entry.secondary_keys) ? (entry.keysecondary || entry.secondary_keys) : [String(entry.keysecondary || entry.secondary_keys || "")],
                        comment: title,
                        content: entry.content ?? entry.text ?? entry.description ?? "",
                        constant: doOverride ? forceConstant : (!!entry.constant),
                        selective: doOverride ? forceSelective : (entry.selective ?? true),
                        selectiveLogic: entry.selectiveLogic ?? 0,
                        addMemo: entry.addMemo ?? true,
                        order: entry.order ?? 100,
                        position: entry.position ?? 0,
                        disable: !!entry.disable,
                        excludeRecursion: !!entry.excludeRecursion,
                        probability: doOverride ? forceProb : (entry.probability ?? 100),
                        useProbability: entry.useProbability ?? true,
                        depth: doOverride ? forceDepth : (entry.depth ?? 4),
                        scanDepth: entry.scanDepth ?? null,
                        caseSensitive: !!entry.caseSensitive,
                        matchWholeWords: entry.matchWholeWords ?? true,
                        useRegexp: !!entry.useRegexp,
                        automationId: entry.automationId ?? ""
                    };

                    worldInfoData.entries[uid] = newEntry;
                    if (existingUid) updatedCount++; else addedCount++;
                });

                await context.saveWorldInfo(selectedWorld, worldInfoData);
                
                if (typeof context.updateWorldInfoList === 'function') await context.updateWorldInfoList();
                if (typeof context.reloadWorldInfoEditor === 'function') {
                    context.reloadWorldInfoEditor(selectedWorld, true);
                } else {
                    $("#world_editor_select").trigger("change");
                }

                const msg = `Success: Added ${addedCount}, Updated ${updatedCount} entries.`;
                $status.text(msg).removeClass("lore-factory-error").addClass("lore-factory-success").show();
                toastr.success(`LoreFactory: ${msg}`);
                return true;
            } catch (e) {
                console.error(`LoreFactory v${VERSION}: Process error:`, e);
                $status.text("Error: " + e.message).removeClass("lore-factory-success").addClass("lore-factory-error").show();
                return false;
            }
        }
    };

    // 3. UI INJECTION
    function init() {
        if (window.LoreFactory_Initialized === VERSION) return;
        window.LoreFactory_Initialized = VERSION;
        
        console.log(`LoreFactory v${VERSION}: Initializing UI...`);
        
        // Delegations
        $(document).on("click", "#lore-factory-process-btn", async (e) => {
            e.preventDefault();
            const success = await LoreFactory.process();
            if (success) setTimeout(() => { if (LoreFactory.currentPopup) LoreFactory.currentPopup.complete(); }, 2500);
        });

        $(document).on("click", "#lore-factory-template-btn", (e) => { e.preventDefault(); LoreFactory.insertTemplate(); });
        $(document).on("click", "#lore-factory-format-btn", (e) => { e.preventDefault(); LoreFactory.format(); });
        $(document).on("click", "#lore-factory-clear-btn", (e) => { e.preventDefault(); LoreFactory.clear(); });
        $(document).on("input", "#lore-factory-input", () => { LoreFactory.updatePreview(); });
        $(document).on("change", 'input[name="lf-mode"]', () => { LoreFactory.updatePreview(); });

        const inject = () => {
            const $newEntryBtn = $("#world_popup_new");
            if ($newEntryBtn.length > 0 && $("#lore_factory_import_btn").length === 0) {
                const $importBtn = $(`
                    <div id="lore_factory_import_btn" class="menu_button fa-solid fa-industry interactable" 
                         title="LoreFactory: Batch Import"></div>
                `);
                $newEntryBtn.after($importBtn);
                $importBtn.on("click", (e) => { e.preventDefault(); LoreFactory.open(); });
            }
        };
        setInterval(inject, 1000);
    }

    window.LoreFactory = LoreFactory;
    init();
})();
