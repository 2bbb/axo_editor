const configure = {
    comments: {
        lineComment: "//",
        blockComment: ["/*", "*/"]
    },
    brackets: [["{", "}"], ["[", "]"], ["(", ")"], ["<", ">"]],
    autoClosingPairs: [
        { open: '"', close: '"', notIn: ["string", "comment"] },
        { open: "{", close: "}", notIn: ["string", "comment"] }, { open: "[", close: "]", notIn: ["string", "comment"] }, { open: "(", close: ")", notIn: ["string", "comment"] }
    ]
};

const language = {
    defaultToken: "",
    tokenPostfix: ".cpp",
    brackets: [
        { token: "delimiter.curly", open: "{", close: "}" },
        { token: "delimiter.parenthesis", open: "(", close: ")" },
        { token: "delimiter.square", open: "[", close: "]" },
        { token: "delimiter.angle", open: "<", close: ">" }
    ],
    keywords: [
        "if", "else", "for", "while", "do", "goto", "return",
        "switch", "case", "default",
        "continue", "break",

        "new", "delete",

        "this", "nullptr", "true", "false", 

        "static_cast", "const_cast", "dynamic_cast", "reinterpret_cast", 

        "throw", "noexcept", 
        "try", "catch",
        "static_assert",

        "decltype", "sizeof", "typeid", "alignof", 

        "const", "constexpr",
        "static", "inline", 
        "extern", "register", "volatile", "thread_local", 

        "enum", "struct", "union", "class", 
        "template", "typename",

        "operator",
        "private", "protected", "public",
        "virtual", "mutable", 
        "friend",
        "override", "finally",
        "explicit", 

        "using", "typedef", 
        "namespace", "std",

        "asm",

        "export",

        "not", "compl", "bitand", "bitor", 
        "not_eq",
        "and", "and_eq",  "or", "or_eq", "xor", "xor_eq", 
        

        // type names
        "auto", 
        "void", "signed", "unsigned", 
        "bool", "char", "short", "int", "long",
        "int8_t", "int16_t", "int32_t", "int64_t", "int128_t",
        "uint8_t", "uint16_t", "uint32_t", "uint64_t", "uint128_t",
        "float", "double", 
        "wchar_t", "char16_t", "char32_t",
        "array", "vector", "map", "deque",
        "thread", 

        // C++/CLI?
        "abstract", "amp", "cpu", "delegate", "each", "event", 
        "final",  "gcnew", "generic", 
        "in", "initonly", "interface", "internal", "literal", 
        
        "__nullptr", "partial", "pascal", "property", 
        "ref", "restrict",  "safe_cast", "sealed",
        "tile_static",  "where",
        
        "interior_ptr", "pin_ptr", 

        "__int128", "__int16", "__int32", "__int64", "__int8",
        "__m128", "__m128d", "__m128i", "__m256", "__m256d", "__m256i", "__m64",
        "__ptr32", "__ptr64",
        "__w64", "__wchar_t",

        "_asm", "_based", "_cdecl", "_declspec", "_fastcall",
        "_if_exists", "_if_not_exists", "_inline",
        "_multiple_inheritance", "_pascal",
        "_single_inheritance", "_stdcall",
        "_virtual_inheritance",
        "__abstract", "__alignof", "__asm", "__assume",
        "__based", "__box", "__builtin_alignof",
        "__cdecl", "__clrcall",
        "__declspec", "__delegate",
        "__event", "__except",
        "__fastcall", "__finally", "__forceinline",
        "__gc", "__hook", "__identifier",
        "__if_exists", "__if_not_exists", "__inline",
        "__interface", "__leave",
        "__multiple_inheritance", "__newslot", "__nogc", "__noop", "__nounwind", "__novtordisp",
        "__pascal", "__pin", "__pragma", "__property",
        "__raise", "__restrict", "__resume",
        "__sealed", "__single_inheritance", "__stdcall", "__super",
        "__thiscall", "__try", "__try_cast", "__typeof",
        "__unaligned", "__unhook", "__uuidof",
        "__value", "__virtual_inheritance",

    ],
    operators: [
        "=", ">", "<", "!", "~", "?", ":",
        "==", "<=", ">=", "!=", "&&", "||",
        "++", "--", "+", "-", "*", "/", "%", 
        "&", "|", "^",
        "<<", ">>", ">>>",
        "+=", "-=", "*=", "/=", "%=",
        "&=", "|=", "^=",
        "<<=", ">>=", ">>>="
    ],
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    integersuffix: /(ll|LL|u|U|l|L)?(ll|LL|u|U|l|L)?/,
    floatsuffix: /[fFlL]?/,
    tokenizer: {
        root: [
            [
                /[a-zA-Z_]\w*/,
                {
                    cases: {
                        "@keywords": { token: "keyword.$0" },
                        "@default": "identifier"
                    }
                }
            ],
            { include: "@whitespace" },
            [/\[\[.*\]\]/, "annotation"],
            [/^\s*#\w+/, "keyword"],
            [/[{}()\[\]]/, "@brackets"],
            [/[<>](?!@symbols)/, "@brackets"],
            [/@symbols/, { cases: { "@operators": "delimiter", "@default": "" } }],
            [/\d*\d+[eE]([\-+]?\d+)?(@floatsuffix)/, "number.float"],
            [/\d*\.\d+([eE][\-+]?\d+)?(@floatsuffix)/, "number.float"],
            [/0[xX][0-9a-fA-F']*[0-9a-fA-F](@integersuffix)/, "number.hex"],
            [/0[0-7']*[0-7](@integersuffix)/, "number.octal"],
            [/0[bB][0-1']*[0-1](@integersuffix)/, "number.binary"],
            [/\d[\d']*\d(@integersuffix)/, "number"],
            [/\d(@integersuffix)/, "number"],
            [/[;,.]/, "delimiter"],
            [/"([^"\\]|\\.)*$/, "string.invalid"],
            [/"/, "string", "@string"],
            [/'[^\\']'/, "string"],
            [
                /(')(@escapes)(')/,
                ["string", "string.escape", "string"]
            ],
            [/'/, "string.invalid"]
        ],
        whitespace: [
            [/[ \t\r\n]+/, ""],
            [/\/\*\*(?!\/)/, "comment.doc", "@doccomment"],
            [/\/\*/, "comment", "@comment"],
            [/\/\/.*$/, "comment"]
        ],
        comment: [
            [/[^\/*]+/, "comment"],
            [/\*\//, "comment", "@pop"],
            [/[\/*]/, "comment"]
        ],
        doccomment: [
            [/[^\/*]+/, "comment.doc"],
            [/\*\//, "comment.doc", "@pop"],
            [/[\/*]/, "comment.doc"]],
        string: [
            [/[^\\"]+/, "string"],
            [/@escapes/, "string.escape"],
            [/\\./, "string.escape.invalid"],
            [/"/, "string", "@pop"]
        ]
    }
};

module.exports = { configure, language }
