import {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  httpRequestsTotal,
  httpRequestDuration,
} from "../metrics";

export function metricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {

  // Ignore Prometheus scraping
 
  //
  // Prometheus periodically calls
  //
  // GET /metrics
  //
  // We don't want this to be counted as an API request.
  //

  if (req.path === "/metrics") {
    return next();
  }

 
  // Start request timer
 

  const start = process.hrtime();

 
  // Wait until response is finished


  res.on("finish", () => {

    const diff = process.hrtime(start);

    // Convert seconds + nanoseconds
    // into seconds

    const duration =
      diff[0] +
      diff[1] / 1e9;

    
    // Get route
    

    const route =
      req.route?.path ||
      req.path;

   
    // Labels
   

    const labels = {
      method: req.method,

      route: route,

      status_code:
        res.statusCode.toString(),
    };

    
    // Increment request counter
    

    httpRequestsTotal.inc(
      labels
    );

    
    // Record request duration
   

    httpRequestDuration.observe(
      labels,
      duration
    );
  });

  

  next();
}