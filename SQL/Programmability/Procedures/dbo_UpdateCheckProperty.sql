SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[UpdateCheckProperty]
(
@ReconcilationID int,
@Mode int,
@Value int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

if(@Mode=1)
begin
 
 Update BankReconcilation set DisplayAll=@Value where ReconcilationID=@ReconcilationID

end
else
begin
 Update BankReconcilation set MarkVoided=@Value where ReconcilationID=@ReconcilationID
end

END



GO