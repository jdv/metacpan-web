package MetaCPAN::Web::Controller::Source;

use Moose;
use namespace::autoclean;

BEGIN { extends 'MetaCPAN::Web::Controller' }

sub index : PathPart('source') : Chained('/') : Args {
    my ( $self, $c, @module ) = @_;

    $c->add_surrogate_key('source');
    $c->res->header(
        'Cache-Control' => 'max-age=' . $c->cdn_times->{one_hour} );

    if ( @module == 1 ) {

        # /source/Foo::bar or /source/AUTHOR/
        $c->cdn_cache_ttl( $c->cdn_times->{one_hour} );

    }
    else {
        # SO can cache for a LONG time
        # /source/AUTHOR/anything e.g /source/ETHER/YAML-Tiny-1.67/
        $c->cdn_cache_ttl( $c->cdn_times->{one_year} );
    }

    my ( $source, $module );
    if ( @module == 1 ) {
        $module = $c->model('API::Module')->find(@module)->recv;
        $module[0] = join q{/}, $module->{author}, $module->{release},
            $module->{path};
        $source = $c->model('API::Module')->source(@module)->recv;
    }
    else {
        ( $source, $module ) = (
            $c->model('API::Module')->source(@module)->recv,
            $c->model('API::Module')->get(@module)->recv,
        );
    }

    if ( $module->{directory} ) {
        my $files = $c->model('API::File')->dir(@module)->recv;
        $c->res->last_modified( $module->{date} );
        $c->stash(
            {
                template => 'browse.html',
                files => [ map { $_->{fields} } @{ $files->{hits}->{hits} } ],
                total => $files->{hits}->{total},
                took  => $files->{took},
                author    => shift @module,
                release   => shift @module,
                directory => \@module,
            }
        );
    }
    elsif ( exists $source->{raw} ) {
        $module->{content} = $source->{raw};
        $c->stash(
            {
                file => $module,
            }
        );
        $c->forward('content');
    }
    else {
        $c->detach('/not_found');
    }
}

sub content : Private {
    my ( $self, $c ) = @_;

    # FIXME: $module should really just be $file
    my $module = $c->stash->{file};

    # could this be a method/function somewhere else?
    if ( !$module->{binary} ) {
        my $filetype = $self->detect_filetype($module);
        $c->stash( { source => $module->{content}, filetype => $filetype } );
    }
    $c->res->last_modified( $module->{date} );
    $c->stash(
        {
            template => 'source.html',
            module   => $module,
        }
    );
}

# Class method to ease testing.
sub detect_filetype {
    my ( $self, $file ) = @_;

    if ( defined( $file->{content} ) ) {
        return 'perl6' if $file->{content} =~ /^\s*use\s+v6/m;
        return 'perl6' if $file->{content} =~ /\s+vim?:\s*ft=perl6/m;
    }

    if ( defined( $file->{path} ) ) {
        local $_ = $file->{path};

        return 'perl6' if /\.[^.]6$/;

        # No separate pod brush as of 2011-08-04.
        return 'perl' if /\. ( p[ml] | psgi | pod ) $/ix;

        return 'perl' if /^ cpanfile $/ix;

        return 'yaml' if /\. ya?ml $/ix;

        return 'javascript' if /\. js(on)? $/ix;

        return 'c' if /\. ( c | h | xs ) $/ix;

        # Are other changelog files likely to be in CPAN::Changes format?
        return 'cpanchanges' if /^ Changes $/ix;
    }

    # If no paths matched try mime type (which likely comes from the content).
    if ( defined( $file->{mime} ) ) {
        local $_ = $file->{mime};

        return 'perl' if /perl/;
    }

    # Default to plain text.
    return 'plain';
}

__PACKAGE__->meta->make_immutable;

1;
