import { Request , Response , NextFunction } from 'express' ; 

function notFoundMiddleware( 
     req: Request,
     res: Response, 
     next: NextFunction
): void {
     res.status(404).json({ message: "Resource Not Found"}); 
}

export default notFoundMiddleware ; 