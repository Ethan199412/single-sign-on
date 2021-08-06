class SessionHandler {
    session = new Set()
    generateSession = (cookie) => {
        if (!cookie.sessionId) {
            let sessionId = `${Math.random()}`
            this.session.add(sessionId)
            this.destorySessionId(sessionId)
            return sessionId
        }
        return
    }
    static instance = () => {
        if (!this.instance) {
            this.instance = new SessionHandler()
        }
        return this.instance
    }
    destorySessionId = (sessionId) => {
        setTimeout(() => {
            this.session.delete(sessionId)
        }, 1000 * 60)
    }
    verifySession = (sessionId) => {
        return this.session.has(sessionId)
    }
}

exports.sessionHandler = SessionHandler.instance