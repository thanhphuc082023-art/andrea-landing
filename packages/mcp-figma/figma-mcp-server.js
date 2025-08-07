import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import * as Figma from 'figma-js';
import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FIGMA_FILE_ID = process.env.FIGMA_FILE_ID;
const MCP_PORT = process.env.MCP_PORT || 3000;

if (!FIGMA_TOKEN) {
  console.error('Error: FIGMA_TOKEN environment variable is required');
  process.exit(1);
}

if (!FIGMA_FILE_ID) {
  console.error('Error: FIGMA_FILE_ID environment variable is required');
  process.exit(1);
}

// Initialize Figma client
const figmaClient = Figma.Client({
  personalAccessToken: FIGMA_TOKEN
});

// Create MCP server
const server = new McpServer({
  name: 'figma-designs',
  version: '1.0.0'
});

// Define the figma tool with enhanced functionality
server.tool(
  'figma',
  {
    action: z.enum(['get_file', 'get_components', 'get_component_details', 'get_styles']).optional().default('get_file'),
    component_name: z.string().optional(),
    file_id: z.string().optional()
  },
  async ({ action, component_name, file_id }) => {
    try {
      const targetFileId = file_id || FIGMA_FILE_ID;
      
      switch (action) {
        case 'get_file':
          const file = await figmaClient.file(targetFileId);
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(file.data, null, 2)
            }]
          };

        case 'get_components':
          const componentsFile = await figmaClient.file(targetFileId);
          const components = extractComponents(componentsFile.data.document);
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(components, null, 2)
            }]
          };

        case 'get_component_details':
          if (!component_name) {
            return {
              content: [{
                type: 'text',
                text: 'Error: component_name is required for get_component_details action'
              }]
            };
          }
          const detailsFile = await figmaClient.file(targetFileId);
          const componentDetails = findComponentByName(detailsFile.data.document, component_name);
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(componentDetails, null, 2)
            }]
          };

        case 'get_styles':
          const stylesFile = await figmaClient.file(targetFileId);
          const styles = extractStyles(stylesFile.data.document);
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(styles, null, 2)
            }]
          };

        default:
          return {
            content: [{
              type: 'text',
              text: 'Error: Invalid action. Available actions: get_file, get_components, get_component_details, get_styles'
            }]
          };
      }
    } catch (error) {
      console.error('Error fetching Figma data:', error);
      return {
        content: [{
          type: 'text',
          text: `Error: ${error.message}`
        }]
      };
    }
  }
);

// Helper function to extract components from Figma document
function extractComponents(node, components = []) {
  if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
    components.push({
      id: node.id,
      name: node.name,
      type: node.type,
      description: node.description || '',
      properties: node.componentPropertyDefinitions || {}
    });
  }

  if (node.children) {
    node.children.forEach(child => extractComponents(child, components));
  }

  return components;
}

// Helper function to find component by name
function findComponentByName(node, targetName) {
  if ((node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') && 
      node.name.toLowerCase().includes(targetName.toLowerCase())) {
    return {
      id: node.id,
      name: node.name,
      type: node.type,
      description: node.description || '',
      properties: node.componentPropertyDefinitions || {},
      styles: node.styles || {},
      constraints: node.constraints || {},
      effects: node.effects || [],
      fills: node.fills || [],
      strokes: node.strokes || []
    };
  }

  if (node.children) {
    for (const child of node.children) {
      const result = findComponentByName(child, targetName);
      if (result) return result;
    }
  }

  return null;
}

// Helper function to extract styles
function extractStyles(node, styles = []) {
  if (node.styles) {
    Object.entries(node.styles).forEach(([styleType, styleId]) => {
      styles.push({
        nodeId: node.id,
        nodeName: node.name,
        styleType,
        styleId
      });
    });
  }

  if (node.children) {
    node.children.forEach(child => extractStyles(child, styles));
  }

  return styles;
}

// Connect to transport and start server
const transport = new StdioServerTransport();
await server.connect(transport);

// Startup confirmation
console.log(`MCP Figma Server running on port ${MCP_PORT}`);
console.log(`Connected to Figma file: ${FIGMA_FILE_ID}`);
