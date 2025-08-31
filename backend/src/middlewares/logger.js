import morgan from 'morgan';

const customFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms';

export const requestLogger = morgan(customFormat, {
  skip: (req, res) => {
    
    return req.url === '/health' || req.url === '/ping';
  }
});