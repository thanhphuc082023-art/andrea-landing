import { type ProjectFormData } from '@/lib/validations/project';

export async function createProject(data: ProjectFormData) {
  // TODO: Implement actual API call

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Return mock response
  return {
    id: Math.floor(Math.random() * 1000),
    ...data,
    createdAt: new Date().toISOString(),
  };
}

export async function updateProject(id: string, data: ProjectFormData) {
  // TODO: Implement actual API call

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Return mock response
  return {
    id,
    ...data,
    updatedAt: new Date().toISOString(),
  };
}
