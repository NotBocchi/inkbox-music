interface CoverBackgroundProps {
  coverUrl?: string;
}

export function CoverBackground({ coverUrl }: CoverBackgroundProps) {
  return (
    <div className="cover-background" aria-hidden="true">
      {coverUrl && <img src={coverUrl} alt="" />}
      <div className="cover-background__color" />
      <div className="cover-background__veil" />
    </div>
  );
}
