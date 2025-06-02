// Number of nodes in the graph
let numberOfNodes = 9;
export let pathsToShow = [];

export const paths = [];
/**
 * A utility function to find the node with the minimum distance
 * value from the set of nodes not yet included in the shortest
 * path tree.
 *
 * @param {number[]} distances - The current shortest distances to each node.
 * @param {boolean[]} visited - Boolean array indicating if a node is already processed.
 * @return {number} The index of the node with the smallest known distance.
 */
function getMinDistanceIndex(distances, visited) {
  let minimum = Number.MAX_VALUE;
  let minIndex = -1;

  for (let node = 0; node < numberOfNodes; node++) {
    if (!visited[node] && distances[node] <= minimum) {
      minimum = distances[node];
      minIndex = node;
    }
  }
  return minIndex;
}

/**
 * Builds the path string from the source to a given node using the parent array.
 *
 * @param {number[]} parents - Array where parents[n] gives the node from which we arrived at 'n'.
 * @param {number} node - The target node for which we want the path.
 * @returns {string} The path from the source to the target node.
 */
function buildPathString(parents, node) {
  // Base case: If 'node' is the source or parents[node] == -1, return this node as a string
  if (parents[node] === -1) {
    return node.toString();
  }

  return buildPathString(parents, parents[node]) + "->" + node.toString();
}

/**
 * Implements Dijkstra's single-source shortest path algorithm for a graph
 * represented using an adjacency matrix.
 *
 * @param {number[][]} adjacencyMatrix - The graph as an adjacency matrix, where
 *   adjacencyMatrix[u][v] is the cost of the edge from u to v (0 if no edge).
 * @param {number} sourceNode - The index of the starting (source) node.
 */
function dijkstra(adjacencyMatrix, sourceNode) {
  // distances[n] will hold the shortest distance from sourceNode to n
  let distances = new Array(numberOfNodes).fill(Number.MAX_VALUE);

  // visited[n] will be true if node n is included in the shortest
  // path tree or if its shortest distance is finalized
  let visited = new Array(numberOfNodes).fill(false);

  // parents[n] will store the previous node in the best path to n
  let parents = new Array(numberOfNodes).fill(-1);

  // Distance from the source to itself is 0
  distances[sourceNode] = 0;

  // Find the shortest path for all nodes
  for (let i = 0; i < numberOfNodes - 1; i++) {
    // Pick the node with the smallest distance among those not yet processed
    let closestNode = getMinDistanceIndex(distances, visited);

    // Mark the chosen node as processed
    visited[closestNode] = true;

    // Update the distances to the adjacent nodes
    for (let adjacentNode = 0; adjacentNode < numberOfNodes; adjacentNode++) {
      if (
        !visited[adjacentNode] &&
        adjacencyMatrix[closestNode][adjacentNode] !== 0 && // There is an edge
        distances[closestNode] !== Number.MAX_VALUE &&
        distances[closestNode] + adjacencyMatrix[closestNode][adjacentNode] <
          distances[adjacentNode]
      ) {
        distances[adjacentNode] =
          distances[closestNode] + adjacencyMatrix[closestNode][adjacentNode];
        parents[adjacentNode] = closestNode;
      }
    }
  }

  // Print the shortest distances and the paths from the source to each node
  for (let node = 0; node < numberOfNodes; node++) {
    if (node !== sourceNode) {
      let pathString = buildPathString(parents, node);
      paths.push([pathString]);
      pathsToShow.push({
        to: node,
        totalCost: distances[node],
        path: pathString,
      });
    }
  }
}

export default dijkstra;
