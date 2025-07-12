export class ApiManager
{
    // GET with callback
    public static get( url: string, callback: ( err: any, result?: any ) => void )
    {
        fetch( url )
            .then( ( res ) => res.json() )
            .then( ( data ) => callback( null, data ) )
            .catch( ( error ) => callback( error ) );
    }

    // POST with callback
    public static post( url: string, payload: any, callback: ( err: any, result?: any ) => void )
    {
        fetch( url,
        {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify( payload )
        } )
        .then( async ( res ) =>
        {
            if (!res.ok)
            {
                const errorData = await res.json().catch( () => ( {} ) );
                const error =
                {
                    status: res.status,
                    message: errorData.message || res.statusText,
                    data: errorData
                };
                throw error;
            }
            return res.json();
        } )
        .then( ( data ) => callback( null, data ) )
        .catch( ( error ) => callback( error ));
    }

    // DELETE with callback
    static delete( url: string, callback: (err: any, result?: any) => void )
    {
        fetch( url,
        {
            method: 'DELETE',
            headers:
            {
                'Content-Type': 'application/json',
            }
        })
        .then( async ( res ) =>
        {
            if (!res.ok)
            {
                const errorData = await res.json().catch( () => ( {} ) );
                const error =
                {
                    status: res.status,
                    message: errorData.message || res.statusText,
                    data: errorData
                };
                throw error;
            }
            return res.json().catch( () => ( {} ) ); // In case DELETE returns empty body
        } )
        .then( ( data ) => callback( null, data ) )
        .catch( ( error ) => callback( error ) );
    }
}
