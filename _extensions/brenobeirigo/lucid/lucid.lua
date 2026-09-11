-- Lucid: build-time accessibility helpers and optional browser enhancements.
--
-- Every feature can be switched off from document or project metadata:
--
--   lucid:
--     accessible-tables: false   # scope attributes and .row-headers tables
--     pseudocode: false          # ```{.pseudocode} blocks as a numbered terminal
--     flowcharts: false          # readable Mermaid sizing and SVG title/desc
--     callouts: false            # keyboard toggles and "Solution to ..." titles
--     copy-refs: false           # copy-reference buttons on numbered labels
--     table-scroll: false        # focusable scroll regions for wide tables
--     page-references: true      # keep the page-local bibliography visible

local VERSION = "1.0.0"

local options = {
  ["accessible-tables"] = true,
  pseudocode = true,
  flowcharts = true,
  callouts = true,
  ["copy-refs"] = true,
  ["table-scroll"] = true,
  ["page-references"] = false,
}

local scripts = {
  { key = "flowcharts", path = "js/flowcharts.js" },
  { key = "callouts", path = "js/callouts.js" },
  { key = "copy-refs", path = "js/copy-refs.js" },
  { key = "table-scroll", path = "js/table-scroll.js" },
}

local function read_options(meta)
  local block = meta.lucid
  if type(block) ~= "table" then
    return nil
  end
  for key in pairs(options) do
    local value = block[key]
    if type(value) == "boolean" then
      options[key] = value
    elseif value ~= nil then
      options[key] = pandoc.utils.stringify(value) ~= "false"
    end
  end
  return nil
end

-- Header cells describe columns; opted-in tables also get a row-header column.
local function Table(tbl)
  if not options["accessible-tables"] then
    return nil
  end

  for _, row in ipairs(tbl.head.rows) do
    for _, cell in ipairs(row.cells) do
      cell.attr.attributes["scope"] = "col"
    end
  end

  if tbl.attr.classes:includes("row-headers") then
    for _, body in ipairs(tbl.bodies) do
      body.row_head_columns = 1
      for _, row in ipairs(body.body) do
        if row.cells[1] then
          row.cells[1].attr.attributes["scope"] = "row"
        end
      end
    end
  end

  return tbl
end

-- Pseudocode is line-addressable, so it always carries line numbers.
local function CodeBlock(block)
  if not options.pseudocode or not block.classes:includes("pseudocode") then
    return nil
  end

  for _, class in ipairs({ "terminal-pseudocode", "numberLines" }) do
    if not block.classes:includes(class) then
      block.classes:insert(class)
    end
  end
  block.attributes["code-line-numbers"] = "true"
  return block
end

local function add_dependencies(meta)
  if not quarto.doc.is_format("html:js") then
    return nil
  end

  local enabled_scripts = {}
  for _, script in ipairs(scripts) do
    if options[script.key] then
      table.insert(enabled_scripts, { path = script.path, afterBody = true })
    end
  end

  local stylesheets = {}
  if options["page-references"] then
    table.insert(stylesheets, "css/page-references.css")
  end

  if #enabled_scripts > 0 or #stylesheets > 0 then
    quarto.doc.add_html_dependency({
      name = "lucid",
      version = VERSION,
      scripts = enabled_scripts,
      stylesheets = stylesheets,
    })
  end
  return nil
end

-- Pandoc visits blocks before metadata, so options are read in a first pass.
return {
  { Meta = read_options },
  { Table = Table, CodeBlock = CodeBlock },
  { Meta = add_dependencies },
}
