# Graph Report - CanastAppF  (2026-05-25)

## Corpus Check
- 66 files · ~71,442 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 504 nodes · 654 edges · 39 communities (25 shown, 14 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `74ddc625`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]

## God Nodes (most connected - your core abstractions)
1. `ProductosPage` - 24 edges
2. `main()` - 14 edges
3. `ApiService` - 14 edges
4. `InventarioPage` - 14 edges
5. `OrdenesPage` - 14 edges
6. `OrdenesService` - 13 edges
7. `UsuariosListadoPage` - 13 edges
8. `MateriaPrima` - 12 edges
9. `Orden` - 12 edges
10. `HomePage` - 12 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (39 total, 14 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (49): architect, build, extract-i18n, lint, serve, test, builder, configurations (+41 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (10): DashboardAction, DashboardActivity, DashboardAlert, DashboardCard, HomePage, MateriaPrima, CreateMovimientoRequest, MovimientoInventario (+2 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (30): devDependencies, @angular/cli, @angular/compiler-cli, @angular-devkit/build-angular, @angular-eslint/builder, @angular-eslint/eslint-plugin, @angular-eslint/eslint-plugin-template, @angular-eslint/schematics (+22 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (4): cantidad, CrearOrdenModalComponent, recetaActual, OrdenesPage

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (3): LineaReceta, map, ProductosPage

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (26): dependencies, @angular/animations, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser, @angular/platform-browser-dynamic (+18 more)

### Community 7 - "Community 7"
Cohesion: 0.13
Nodes (9): CreateUsuarioRequest, CreateUsuarioResponse, LoginRequest, LoginResponse, Rol, RolInfo, Usuario, ApiService (+1 more)

### Community 8 - "Community 8"
Cohesion: 0.09
Nodes (23): setParserOptionsProject, setParserOptionsProject, prefix, projectType, root, schematics, sourceRoot, cli (+15 more)

### Community 9 - "Community 9"
Cohesion: 0.12
Nodes (7): LoginRequest, LoginResponse, Rol, UsuarioAuth, AuthService, PermissionService, SocketService

### Community 10 - "Community 10"
Cohesion: 0.16
Nodes (9): RecetaProducto, ValidacionStockResponse, CreateProductoRequest, Producto, RecetaIngrediente, RecetaItem, UpdateProductoRequest, ProductoService (+1 more)

### Community 11 - "Community 11"
Cohesion: 0.17
Nodes (10): CreateOrdenDTO, CreateOrdenRequest, CreateOrdenResponse, EntregaProducto, MateriaPrimaReceta, Orden, Producto, RegistroProduccion (+2 more)

### Community 12 - "Community 12"
Cohesion: 0.15
Nodes (6): routes, AppComponent, fixture, authGuard(), permissionGuard(), jwtInterceptor()

### Community 13 - "Community 13"
Cohesion: 0.14
Nodes (4): OfflineQueueItem, NetworkService, OfflineQueueService, StorageService

### Community 14 - "Community 14"
Cohesion: 0.23
Nodes (13): install.sh script, available(), check_gpu(), configure_systemd(), download_and_extract(), error(), install_cuda_driver_apt(), install_cuda_driver_yum() (+5 more)

### Community 15 - "Community 15"
Cohesion: 0.14
Nodes (13): author, description, homepage, name, private, scripts, build, lint (+5 more)

### Community 20 - "Community 20"
Cohesion: 0.33
Nodes (5): Angular Doctor Report, Diagnostics, eslint/parse-error, Score, Summary

### Community 21 - "Community 21"
Cohesion: 0.50
Nodes (3): ignore, files, rules

### Community 22 - "Community 22"
Cohesion: 0.50
Nodes (3): ignorePatterns, overrides, root

### Community 23 - "Community 23"
Cohesion: 0.50
Nodes (3): integrations, name, type

## Knowledge Gaps
- **142 isolated node(s):** `root`, `ignorePatterns`, `overrides`, `rules`, `files` (+137 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ApiService` connect `Community 7` to `Community 1`, `Community 9`, `Community 10`, `Community 11`, `Community 13`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `architect` connect `Community 0` to `Community 8`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Community 3` to `Community 15`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `root`, `ignorePatterns`, `overrides` to the rest of the system?**
  _142 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.04931972789115646 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.0915915915915916 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._