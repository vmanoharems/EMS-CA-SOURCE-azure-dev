SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[CheckPCEnvelopeNumberDuplicacy] -- CheckPCEnvelopeNumberDuplicacy '123',0,3
	-- Add the parameters for the stored procedure here
@EnvelopeNumber nvarchar(50),
@PcEnvelopeID int,
@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	if exists(select * from PCEnvelope where  EnvelopeNumber=@EnvelopeNumber and ProdId=@ProdId and PcEnvelopeID<>@PcEnvelopeID)
	begin
	select 1;
	end
	else
	begin
	select 0;
	end
END



GO