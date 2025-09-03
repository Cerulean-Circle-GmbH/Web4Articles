/**
 * RouteHandler Interface - HTTP route handler definition
 * 
 * Web4 principle: Single interface per file
 * Type safety for HTTP server routing functionality
 */

export interface RouteHandler {
  /**
   * HTTP method (GET, POST, PUT, DELETE, etc.)
   */
  method: string;

  /**
   * Route path pattern
   */
  path: string;

  /**
   * Handler function for the route
   */
  handler: (request: HttpRequest, response: HttpResponse) => Promise<void>;
}