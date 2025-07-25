import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    // 1. Verificar existencia del header Authorization
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Token de autenticación no proporcionado',
            code: 'MISSING_AUTH_HEADER'
        });
    }

    // 2. Extraer el token del header
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({
            success: false,
            message: 'Formato de token inválido. Use: Bearer <token>',
            code: 'INVALID_TOKEN_FORMAT'
        });
    }

    const token = tokenParts[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token no proporcionado',
            code: 'MISSING_TOKEN'
        });
    }

    // 3. Verificar y decodificar el token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Validar estructura del token decodificado
        if (!decoded.idUser || !decoded.email) {
            return res.status(401).json({
                success: false,
                message: 'Token no contiene la información necesaria',
                code: 'INVALID_TOKEN_CONTENT'
            });
        }

        // 5. Adjuntar información del usuario al request
        const { idUser, email } = decoded;
req.user = { idUser, email };
      
        

        next();
    } catch (error) {
        // 6. Manejar diferentes tipos de errores de JWT
        let message = 'Token inválido';
        let code = 'INVALID_TOKEN';
        
        if (error.name === 'TokenExpiredError') {
            message = 'Token expirado';
            code = 'TOKEN_EXPIRED';
        } else if (error.name === 'JsonWebTokenError') {
            message = 'Token malformado';
            code = 'MALFORMED_TOKEN';
        }

        return res.status(401).json({
            success: false,
            message,
            code,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default verifyToken;