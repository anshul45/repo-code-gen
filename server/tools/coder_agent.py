

def coder_agent(prompt: str):
    """
    Coder agent is a function that takes a prompt as input and returns a coded response.
    
    Args:
        prompt (str): The prompt to be coded.
        
    Returns:
        str: The coded response.
    """
    # Coder agent implementation
    return """
  The project details are:
                # Project Configuration

                    ## Story Selection
                    - When fetching user stories:
                    - Present stories for user selection
                    - Allow user to select target stories for implementation by story title
                    - Remember User selection and user story through out the chat
                    - Keep repeating unfinished task in output so that it don't get lost.

                    ## Technology Stack
                    - Next.js with TypeScript
                    - Prisma ORM
                    - NextAuth.js
                    - ShadCN UI
                    - Tailwind CSS
                    - Zustand State Management
                    - Jest Testing
                    - PNPM Package Manager

                    # Development Guidelines

                    ## Package Management
                    - Use PNPM for all package installations and management
                    - Verify package.json for dependencies before adding new ones
                    - Maintain lock file integrity

                    ## Code Architecture
                    - Follow Next.js 14+ App Router structure
                    - Maintain separation of concerns:
                    - Components in /components
                    - API routes in /app/api
                    - Utilities in /utils
                    - Types in /types
                    - Constants in /constants
                    - Hooks in /hooks
                    - Store management in /store
                    - Validations in /validations

                    ## Component Guidelines
                    - Use ShadCN UI components from /components/ui/*
                    - Follow atomic design principles
                    - Maintain consistent component structure:
                    - Props interface at top
                    - Component logic
                    - JSX return
                    - Use custom hooks for reusable logic

                    ## Database & API
                    - Use Prisma for all database operations
                    - Follow REST API patterns in /app/api routes
                    - Implement proper error handling and validation
                    - Use zod schemas from /validations for data validation

                    ## Authentication
                    - Use NextAuth.js for authentication
                    - Follow existing auth patterns in /app/(auth)

                    ## State Management
                    - Use Zustand for global state management
                    - Follow store patterns in /store directory
                    - Keep stores atomic and focused

                    ## Styling
                    - Use Tailwind CSS for styling
                    - Follow existing color scheme and design system
                    - Maintain responsive design patterns

                    ## Testing
                    - Write Jest tests for new components
                    - Follow existing test patterns in __tests__
                    - Include unit tests for utilities and hooks
                    - Test API routes for proper error handling

                    ## Error Handling
                    - Use custom error boundaries
                    - Implement proper API error responses
                    - Follow error handling patterns in /app/error.tsx

                    ## Path Aliases
                    - Use @/ prefix for imports (configured in tsconfig.json)
                    - Maintain consistent import structure
                    - Follow existing import patterns

                    ## Code Style
                    - Follow existing TypeScript patterns
                    - Use proper type definitions
                    - Ignore formatting-related linting:
                    - Quote style (single/double)
                    - Whitespace
                    - Indentation

                    ## Implementation Flow
                    1. Database Schema (if needed)
                    2. API Routes
                    3. Types/Interfaces
                    4. Store/Hooks
                    5. Components
                    6. Tests

                    ## Response Generation Rules
                    - Analyze existing implementations before adding new code
                    - Follow established patterns in similar files
                    - Use existing utility functions from /utils
                    - Implement proper error handling at all levels
                    - Include necessary type definitions
                    - Add appropriate tests
                    - Follow the project's component hierarchy
                    - Use existing validation schemas or create new ones following patterns
                    - Implement proper loading and error states
                    - Follow existing authentication patterns
                    - Use appropriate ShadCN UI components
                    - Follow existing store patterns for state management

                    ## Code Modification Rules
                    - Only modify files related to current task
                    - Preserve existing patterns and conventions
                    - Maintain type safety
                    - Keep changes focused and minimal
                    - Follow existing error handling patterns
                    - Preserve existing test coverage

                    ## Quality Checks
                    - Verify TypeScript types
                    - Ensure Prisma schema integrity
                    - Check component composition
                    - Verify API route implementation
                    - Validate auth integration
                    - Test store implementation
                    - Verify responsive design
                    - Check accessibility
                    - Validate error handling

                    ## Images Access
                    - for some code generation, the images are required to display on UI, use random images using picsum, for example: https://picsum.photos/200/300
"""