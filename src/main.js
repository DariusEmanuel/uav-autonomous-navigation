import "./style.css";
import { Network } from "vis-network/standalone";
import Handsontable from "handsontable";
import "handsontable/styles/handsontable.css";
import "handsontable/styles/ht-theme-main.css";

import dijkstra, { paths, pathsToShow } from "./dijkstra.js";
import { adjacencyMatrix } from "./input.js";
import mapParams from "./graph-map.js";

/**
 * Builds an array of nodes for the network.
 */
function buildNodes() {
  return adjacencyMatrix.map((_, index) => ({
    id: index,
    label: `Node ${index}`,
  }));
}

/**
 * Builds an array of edges (default: black, non-duplicate).
 */
function buildEdges() {
  const edges = [];
  const edgeSet = new Set(); // Prevents duplicate edges

  for (let i = 0; i < adjacencyMatrix.length; i++) {
    for (let j = i + 1; j < adjacencyMatrix[i].length; j++) {
      if (adjacencyMatrix[i][j] > 0) {
        let edgeKey = `${Math.min(i, j)}-${Math.max(i, j)}`; // Normalize direction

        if (!edgeSet.has(edgeKey)) {
          edges.push({
            from: i,
            to: j,
            label: `${adjacencyMatrix[i][j]} mins`,
            arrows: "",
            color: "black", // Default edge color
            width: 2, // Default thickness
          });
          edgeSet.add(edgeKey);
        }
      }
    }
  }

  return edges;
}

/**
 * Highlights the selected shortest path by modifying the edges.
 * @param {number} selected - The selected node index.
 * @param {Array} edges - The existing edges array.
 */
function highlightPath(selected, edges) {
  const decoupledPaths = paths[selected - 1][0]
    .split("->")
    .splice(1)
    .map((el) => Number(el));

  if (decoupledPaths.length > 0) {
    let previousNode = 0; // Start from node 0
    for (let i = 0; i < decoupledPaths.length; i++) {
      let nextNode = decoupledPaths[i];

      // Find existing edge and update it
      let edgeIndex = edges.findIndex(
        (edge) =>
          (edge.from === previousNode && edge.to === nextNode) ||
          (edge.from === nextNode && edge.to === previousNode)
      );

      if (edgeIndex !== -1) {
        // Edge exists, modify color and width
        edges[edgeIndex].color = "red";
        edges[edgeIndex].width = 4;
      } else {
        // Edge does not exist, add a new one
        edges.push({
          from: previousNode,
          to: nextNode,
          label: `${adjacencyMatrix[previousNode][nextNode]} mins`,
          arrows: "",
          color: "red",
          width: 4,
        });
      }

      previousNode = nextNode;
    }
  }
}

/**
 * Updates the network visualization when a new selection is made.
 * @param {number} selected - The selected node index.
 */
function updateNetwork(selected) {
  const { container, options } = mapParams;

  const nodes = buildNodes();
  const edges = buildEdges();
  highlightPath(selected, edges);

  new Network(container, { nodes, edges }, options);
}

const matrixRef = document.getElementById("matrix");

new Handsontable(matrixRef, {
  data: adjacencyMatrix,
  readOnly: true,
  licenseKey: "non-commercial-and-evaluation",
});

// Meeting point node (0)
dijkstra(adjacencyMatrix, 0);

// document.getElementById("removeBtn").addEventListener("click", function () {
//   const nodeA = parseInt(document.getElementById("input1").value);
//   const nodeB = parseInt(document.getElementById("input2").value);

//   adjacencyMatrix[nodeA][nodeB] = adjacencyMatrix[nodeB][nodeA] = 0;
//   dijkstra(adjacencyMatrix, 0);
//   onChangeCallback();
// });

const information = document.getElementById("information");

// Event listener for radio button changes
document.querySelectorAll('input[name="drone"]').forEach((radio) => {
  radio.addEventListener("change", () => onChangeCallback());
});

function onChangeCallback() {
  const selected = document.querySelector('input[name="drone"]:checked').value;
  updateNetwork(selected);

  const { to, totalCost, path } = pathsToShow[selected - 1];
  information.innerHTML = `To get from <strong>Node 0</strong> to <strong>Node ${to}</strong>, the minimum cost is ${totalCost} mins.\n
  This is the most time-efficient route\n ${path}`;
}
