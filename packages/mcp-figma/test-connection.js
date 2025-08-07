import * as Figma from 'figma-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FIGMA_FILE_ID = process.env.FIGMA_FILE_ID;

console.log('🧪 Testing Figma connection...\n');

// Check environment variables
if (!FIGMA_TOKEN || FIGMA_TOKEN === 'your_figma_personal_access_token_here') {
  console.error('❌ FIGMA_TOKEN not configured properly');
  console.log('📝 Please update FIGMA_TOKEN in .env file');
  process.exit(1);
}

if (!FIGMA_FILE_ID || FIGMA_FILE_ID === 'your_figma_file_id_here') {
  console.error('❌ FIGMA_FILE_ID not configured properly');
  console.log('📝 Please update FIGMA_FILE_ID in .env file');
  process.exit(1);
}

console.log('✅ Environment variables configured');
console.log(`📁 File ID: ${FIGMA_FILE_ID}`);
console.log(`🔑 Token: ${FIGMA_TOKEN.substring(0, 10)}...`);

// Test Figma API connection
try {
  console.log('\n🔌 Testing Figma API connection...');
  
  const figmaClient = Figma.Client({
    personalAccessToken: FIGMA_TOKEN
  });

  const file = await figmaClient.file(FIGMA_FILE_ID);
  
  console.log('✅ Successfully connected to Figma API!');
  console.log(`📄 File name: ${file.data.name}`);
  console.log(`📅 Last modified: ${file.data.lastModified}`);
  console.log(`👤 Created by: ${file.data.document.name || 'Unknown'}`);
  
  // Count components
  let componentCount = 0;
  function countComponents(node) {
    if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
      componentCount++;
    }
    if (node.children) {
      node.children.forEach(countComponents);
    }
  }
  
  countComponents(file.data.document);
  console.log(`🧩 Components found: ${componentCount}`);
  
  console.log('\n🎉 Test completed successfully!');
  console.log('🚀 You can now run the MCP server with: pnpm start');
  
} catch (error) {
  console.error('\n❌ Failed to connect to Figma API');
  console.error('Error:', error.message);
  
  if (error.message.includes('403')) {
    console.log('\n💡 Possible solutions:');
    console.log('   - Check if your token has the correct permissions');
    console.log('   - Verify the token is still valid');
    console.log('   - Make sure you have access to the file');
  } else if (error.message.includes('404')) {
    console.log('\n💡 Possible solutions:');
    console.log('   - Check if the file ID is correct');
    console.log('   - Verify the file exists and you have access');
  }
  
  process.exit(1);
}
