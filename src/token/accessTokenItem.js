import Scope from './scope'
import BaseTokenItem from './baseTokenItem'

const DEFAULT_EXPIRE_IN_SECONDS = 3600
const DEFAULT_EXPIRATION_BUFFER = 300

export default class AccessTokenItem extends BaseTokenItem{
    constructor(tokenResponse, clientId) {
        if (!tokenResponse.accessToken) {
            throw new Error('Invalid token response. Can not create access token.')
        }
        super(tokenResponse, clientId)

        this.accessToken = tokenResponse.accessToken
        this.scope = typeof tokenResponse.scope != 'undefined' ? new Scope(tokenResponse.scope) : Scope.basicScope()
        this.expireOn = Date.now() + (tokenResponse.expiresIn ? parseInt(tokenResponse.expiresIn) : DEFAULT_EXPIRE_IN_SECONDS)*1000
    }

    tokenKey() {
        return BaseTokenItem.createAccessTokenKey(this.clientId, this.userId, this.scope)
    }

    isExpired() {
        const validity = Date.now() + DEFAULT_EXPIRATION_BUFFER
        return this.expireOn < validity
    }

    static fromJson(objStr) {
        let obj = Object.create(AccessTokenItem.prototype)
        return Object.assign(obj, JSON.parse(objStr))
    }
}