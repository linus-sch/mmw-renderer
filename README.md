<div align="center">
  <h2 id="readme-top">
    <img src="https://raw.githubusercontent.com/linus-sch/mmw-renderer/refs/heads/main/SRC/assets/logo-mmw-dev.png" width="100px" alt="Mind Map Wizard Engine Logo"/>
    <br>
    Mind Map Wizard — Renderer
    <br><br> 
  </h2>
</div>




A powerful, lightweight JavaScript engine that transforms JSON-based mind map data into interactive, beautiful SVG visualizations. Designed for high performance and flexibility, it supports advanced features like inline Markdown, rich notes, and smooth animations.<br>

<br>

## Features
- **SVG Mind Map Rendering** — Rendering JSON-based mind map data into interactive, beautiful SVG visualizations.
- **Direct Text Editing** — Real-time updates as you edit the underlying JSON structure.
- **Smooth Animations** — Smooth animations for all mind map interactions like editing, deleting, and adding nodes.
- **Mind Map Style Customization** — Customizable mind map styles via the `mm-settings` object in the JSON file.

<h4 align="center">
  <a href="https://js.mindmapwizard.com">
    <img src="https://raw.githubusercontent.com/linus-sch/mmw-renderer/refs/heads/main/SRC/assets/demo-btn.png" alt="Demo button of Mind Map Wizard" style="width: 120px;">
  </a>
</h4>
<br>


## Interaction & Controls
  <figure>
  <img src="https://raw.githubusercontent.com/linus-sch/Mind-Map-Wizard/refs/heads/main/graphics/context-menu.jpg" alt="A screenshot of the context menu" />
    <figcaption>
      <p align="center">
          A screenshot of the context menu and all its options.
      </p>
    </figcaption>
  </figure>
The renderer provides a rich set of interactive features for managing your mind maps:

- **Node Interaction**:
  - **Single Click**: Opens the context menu for quick actions.
  - **Double Click**: Enters direct text editing mode on the node.
  - **Long Press**: Opens the rich notes drawer for the selected node.
  - **Hover**: Reveals the "Add Child" button for quick hierarchy expansion.
- **Canvas Controls**:
  - **Pan & Zoom**: Drag the canvas to move around; use the mouse wheel or UI buttons to zoom.
  - **Fit to Screen**: Automatically centers and scales the mind map to fit the viewport.
- **Context Menu**: Right-click (or single click) any node to access options like adding children, deleting nodes, or changing branch colors.
- **History**: Full Undo/Redo support (`Cmd/Ctrl + Z` and `Cmd/Ctrl + Shift + Z`) for all structural changes.
- **Auto-Save**: Changes are automatically persisted to local storage and can be synced with a backend API.

## Configuration (`mm-settings`)

The renderer can be customized via the `mm-settings` object in your JSON input:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `style` | `string` | The theme to use (`"1"` for Default, `"3"` for Clean). |
| `spacing` | `number` | Vertical spacing between nodes (default: `30`). |
| `levelSpacing` | `number` | Horizontal spacing between levels (default: `100`). |
| `fontFamily` | `string` | The font family used for rendering (default: `"system-ui"`). |
| `fontWeight` | `string` | The font weight for standard nodes (default: `"400"`). |
| `nodeRadius` | `number` | Corner radius for node backgrounds (default: `14`). |
| `linkWidth` | `number` | Thickness of the branch lines (default: `4`). |
| `contextUrls` | `array` | List of URLs to display as domain badges on the root node. |


## Attribution
If you share demos, screenshots, or examples publicly, include this credit where reasonable:

"Mind Map Wizard Renderer by Linus-sch"
<br>

## Contributing
This repo is intended as a demo/reference. Contributions are welcome as output improvements or bug reports. Do not submit changes that attempt to remove or weaken the license restrictions.
<br>

## Contact

If you have any questions or feedback, please get in touch with us.
<br>

<a href="mailto:contact@mindmapwizard.com">contact@mindmapwizard.com</a>
<br>
<p align="right" style="font-size: 14px; color: #555; margin-top: 20px;">
    <a href="#readme-top" style="text-decoration: none; color: #007bff; font-weight: bold;">
        ↑ Back to Top ↑
    </a>
</p>
