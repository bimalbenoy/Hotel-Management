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

  


  if (req.path === "/metrics") {
    return next();
  }

 

  const start = process.hrtime();



  res.on("finish", () => {

    const diff = process.hrtime(start);



    const duration =
      diff[0] +
      diff[1] / 1e9;



    const route =
      req.route?.path ||
      req.path;


    const labels = {
      method: req.method,

      route: route,

      status_code:
        res.statusCode.toString(),
    };



    httpRequestsTotal.inc(
      labels
    );

  

    httpRequestDuration.observe(
      labels,
      duration
    );
  });

 

  next();
}