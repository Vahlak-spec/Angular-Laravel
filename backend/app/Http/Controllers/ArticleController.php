<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;
use App\Http\Resources\ArticleResource;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     * 
     *  @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $response['code'] = 200;
        $response['message'] = 'Articles have been successfully downloaded!';
        $response['data'] = ArticleResource::collection(Article::all());

        return response()->json($response, 200);
    }

    /**
     * Store a newly created resource in storage.
     *  
     *  @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {

        try {
            Article::create($request->all());

            $response['code'] = 200;
            $response['message'] = 'Article was created successfully!';

            return response()->json($response, 200);

        } catch (\Throwable $th) {
            $response['code'] = $th->getCode();
            $response['message'] = $th->getMessage();

        return response()->json($response,  $response['code']);
        }
        
    }

    /**
     * Display the specified resource.
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(string $id)
    {
        try {
            if(Article::where('id', $id)->exists()){

                $response['code'] = 200;
                $response['message'] = 'Article was found successfully!';
                $response['data'] = new ArticleResource(Article::find($id));
        
                return response()->json($response, 200);
            } else {
                $response['code'] = 404;
                $response['message'] = 'Article was not found!';
        
                return response()->json($response, $response['code']);
            }
        } catch (\Throwable $th) {
            $response['code'] = $th->getCode();
            $response['message'] = $th->getMessage();

            return response()->json($response, $response['code']);
        }
        
    }

    /**
     * Update the specified resource in storage.
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, string $id)
    {
        try {
            if(Article::where('id', $id)->exists()){
                $article = Article::find($id);
                $article->title = $request->title;
                $article->content = $request->content;
                $article->author = $request->author;
    
                $article->save();
    
                $response['code'] = 200;
                $response['message'] = 'Article was updated successfully!';
        
                return response()->json($response, $response['code']);
            } else {
                $response['code'] = 404;
                $response['message'] = 'Article was not found!';
        
                return response()->json($response, $response['code']);
            }
        } catch (\Throwable $th) {
            $response['code'] = $th->getCode();
            $response['message'] = $th->getMessage();

            return response()->json($response, $response['code']);
        }
        
    }

    /**
     * Remove the specified resource from storage.
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(string $id)
    {
        try {
            if(Article::where('id',$id)->exists()){
                $article = Article::find($id);
                $article->delete();
    
                $response['code'] = 200;
                $response['message'] = 'Article was deleted successfully!';
        
                return response()->json($response, $response['code']);
            } else {
                $response['code'] = 404;
                $response['message'] = 'Article was not found!';
    
                return response()->json($response,  $response['code']);
            }
        } catch (\Throwable $th) {
            $response['code'] = $th->getCode();
            $response['message'] = $th->getMessage();

            return response()->json($response, $response['code']);
        }
        
    }
}
