-- DACT theme: inject the after-body enhancement scripts.
-- Scripts are attached as an HTML dependency so they resolve relative to
-- this extension regardless of where the calling project lives.

local function enabled(meta, key)
  local opts = meta["dact"]
  if opts == nil or opts[key] == nil then
    return true
  end
  return opts[key] ~= false
end

function Meta(meta)
  if not quarto.doc.is_format("html:js") then
    return meta
  end

  local scripts = {}
  local candidates = {
    { key = "flowchart-layout",   file = "js/flowchart-layout.js" },
    { key = "solution-callouts",  file = "js/solution-callouts.js" },
    { key = "exercise-numbering", file = "js/exercise-numbering.js" },
    { key = "table-layout",       file = "js/table-layout.js" },
  }
  for _, c in ipairs(candidates) do
    if enabled(meta, c.key) then
      table.insert(scripts, { path = c.file, afterBody = true })
    end
  end

  if #scripts > 0 then
    quarto.doc.add_html_dependency({
      name = "dact-theme",
      version = "1.0.0",
      scripts = scripts,
    })
  end
  return meta
end
