<?php

namespace App\Helpers;

use Symfony\Component\HttpFoundation\Response;

class ApiResponse
{
    public static function error($data = null, $message, $status = Response::HTTP_BAD_REQUEST )
    {
        return response()->json([
            'data' => $data,
            'message' => $message,
            'error' => true,
        ], $status);
    }

    public static function success($data = null, $message, $status = Response::HTTP_OK)
    {
        return response()->json([
            'data' => $data,
            'message' => $message,
            'error' => false,
        ], $status);
    }
}